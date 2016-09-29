﻿#I @"..\packages\"
#r @"Suave.1.1.3\lib\net40\Suave.dll"
#r @"Newtonsoft.Json.8.0.3\lib\net40\Newtonsoft.Json.dll"
#r @"FSharp.Data.2.3.0\lib\net40\FSharp.Data.dll"
#load "Web.fs"
#load "Data.fs"
#load "Clusters.fs"
#load "Tree.fs"

open Suave
open System.IO
open Suave.Filters
open Suave.Successful
open Suave.Operators
open System
open Suave.Json
open Suave.Files
open CEServer.Web
open CEServer.Data
open CEServer.Clusters
open Suave.Redirection
open Suave.Writers
open System.Web
open System.Threading
open CEServer.Tree
open Newtonsoft.Json
open Newtonsoft.Json.Serialization

let places, crimeTypes, crimes = openData
let stats = calculateStatistics crimes crimeTypes
let foundStats = calculateSuspectFoundStatistics crimes crimeTypes
let similarPlaces = getClusters stats places crimeTypes
let similarPlacesWithSuspect = getClusters foundStats places crimeTypes
let byPlace = crimesByPlace crimes places
let byType = crimesByType crimes crimeTypes
let mtree = manualTree crimes
let mprediction = manualpredict mtree places

type Prediction = {Place:string; Found:int}
let predictions =
    crimeTypes
    |> Seq.map(fun ent -> ent.Id, mprediction ent.Id |> Seq.map(fun (pl,f) -> {Place = pl; Found = f})|> Seq.toList)
    |> Map.ofSeq

type Preprocessed = {ByPlace:Statistics list; ByType:Statistics list; CrimeTypes:Entity list; SimilarPlaces:Similars list; SimilarPlacesWithSuspect:Similars list; Predictions : Map<int, Prediction list>}
let preprocessed = {ByPlace=byPlace|>Seq.toList; ByType = byType|>Seq.toList; CrimeTypes=crimeTypes; SimilarPlaces=similarPlaces|>Array.toList; SimilarPlacesWithSuspect=similarPlacesWithSuspect|>Array.toList; Predictions = predictions}
let serialized = JsonConvert.SerializeObject(preprocessed)
let perprfile = __SOURCE_DIRECTORY__ + "\preprocessed.json"
File.WriteAllText(perprfile, serialized)
    
