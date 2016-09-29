﻿namespace CEServer
open CEServer.Data

module Tree =
    type Feature<'a> = 'a -> int Option
    type NamedFeature<'a> = string*Feature<'a>
    type Label<'a, 'b when 'b:equality> = 'a -> 'b
    type Tree<'a, 'b when 'b:equality> =
        |Answer of 'b
        |Stump of NamedFeature<'a> * int * Map<int, Tree<'a,'b>>

    let mostFrequentBy f sample =
        sample
        |> Seq.map f
        |> Seq.countBy id
        |> Seq.maxBy snd
        |> fst

    let hasData extractFeature = extractFeature >> Option.isSome

    let entropy extract data =
        let size = data |> Seq.length
        data
        |> Seq.map (fun obs -> extract obs)
        |> Seq.countBy id
        |> Seq.map (fun (_, count) -> float count/float size)
        |> Seq.sumBy (fun f -> if f > 0. then -f*log f else 0.)

    let splitEntropy extractLabel extractFeature data =
        let dataWithValues =
            data
            |> Seq.filter(extractFeature |> hasData)
        let size = dataWithValues |> Seq.length
        dataWithValues
        |> Seq.groupBy(extractFeature)
        |> Seq.sumBy(fun (_, group) ->
            let groupSize = group|> Seq.length
            let probaGroup = float groupSize / float size
            let groupEntropy = group |> entropy extractLabel
            probaGroup * groupEntropy)
    
    let rec growTree filters sample label features =
        let features =
            features
            |> Map.filter(fun name feature ->
                filters |> Seq.forall(fun filter -> filter sample label feature))
        if (Map.isEmpty features)
        then sample |> mostFrequentBy label |> Answer
        else
            let (bestName, bestFeature) =
                features
                |> Seq.minBy(fun kv -> splitEntropy label kv.Value sample)
                |> (fun kv -> kv.Key, kv.Value)
            let branches =
                sample
                |> Seq.groupBy bestFeature
                |> Seq.filter (fun(value, group) -> value.IsSome)
                |> Seq.map(fun(value, group) -> value.Value, group)
            let defaultValue =
                branches
                |> Seq.maxBy(fun(value, group) -> group |> Seq.length)
                |> fst
            let remainingFeatures = features |> Map.remove bestName
            let nextLevel = 
                branches
                |> Seq.map (fun(value, group) -> value, growTree filters group label remainingFeatures)
                |> Map.ofSeq
            Stump((bestName, bestFeature), defaultValue, nextLevel)

    let entropyGainFilter sample label feature =
        splitEntropy label feature sample - entropy label sample < 0.0

    let leafSizeFilter minSize sample label feature =
        sample
        |> Seq.map feature
        |> Seq.choose id
        |> Seq.countBy id
        |> Seq.forall(fun(_, groupsize) -> groupsize > minSize)
    
    let filters = [entropyGainFilter; leafSizeFilter 10]
    let features = [
        "Place", fun(cr:Crime) -> cr.Place |> Some
        "Type", fun(cr:Crime) -> cr.Type |> Some
        ]
    
    let manualTree data = 
        let hasOutcome = data |> List.filter(fun (cr : Crime) -> cr.Outcome <> 0)
        let suspectFoud(cr:Crime) = cr.Outcome <> 1
        growTree filters hasOutcome suspectFoud (features |> Map.ofList)

    let rec decide tree observation =
        match tree with
        | Answer(labelValue) -> labelValue
        | Stump((featureName,feature), valueWhenMissing, branches) ->
            let featureValue = feature observation
            let usedValue = 
                match featureValue with
                | None -> valueWhenMissing
                | Some(value) ->
                    match (branches.TryFind value) with
                        | None -> valueWhenMissing
                        | Some(_) -> value
            let nextLevelTree = branches.[usedValue]
            decide nextLevelTree observation

    let manualpredict tree (places : Entity list) crimeType =        
        places
        |> Seq.map(fun place -> (place.Label, decide tree {Place = place.Id; Type= crimeType ; Outcome = 0}))
        |> Seq.map(fun(lbl, pred) -> lbl, if pred = true then 1 else 0)
        |> Seq.toList