﻿let sum x =
    let sumOne y =
        x + y
    sumOne

let printHello() = printfn "hello"

module Person =

    type T = {First:string; Last:string} with
        member this.FullName =
            this.First + " " + this.Last

        static member Populate first last =
            {First = first; Last = last}
            
    let create first last =
         {First=first; Last=last}

    type T with
        member this.SortableName =
            this.Last + " " + this.First

module PersonExtension =
    type Person.T with
        member this.UppercaseName =
            this.FullName.ToUpper()

    type System.Int32 with
        member this.IsEven = 
            this % 2 = 0

let p = Person.create "Jown" "Dow"
let full = p.FullName
let sortable = p.SortableName
open PersonExtension
let uppercase = p.UppercaseName
let i = 20
let even = i.IsEven
let p2 = Person.T.Populate "Foo" "Boo"


type Stack = StackContents of float list

let newStack = StackContents [1.0; 2.0; 3.0]

let (StackContents contents) = newStack

let push x (StackContents contents) =
    StackContents(x :: contents)

let emptyStack = StackContents []
let stackWith1 = push 1.0 emptyStack
let stackWith2 = push 2.0 stackWith1

let ONE = push 1.0
let TWO = push 2.0
let THREE = push 3.0
let FOUR = push 4.0
let FIVE = push 5.0
let EMPTY = StackContents []

let result321 = EMPTY |> ONE |> TWO |> THREE
let result123 = EMPTY |> THREE |> TWO |> ONE

let pop (StackContents contents) =
    match contents with
    | top::rest ->
        let newStack = StackContents rest
        (top, newStack)
    | [] -> failwith "Stack underflow"

let initialStack = EMPTY |> ONE |> TWO
let popped, poppedStack = pop initialStack
let popped2, poppedStack2 = pop poppedStack

let binary mathFn stack =
    let y, stack' = pop stack
    let x, stack'' = pop stack'
    let result = mathFn x y
    push result stack''

let unary mathFn stack =
    let x, stack' = pop stack
    let y = mathFn x
    push y stack'

let ADD = binary (+)
let MUL = binary (*)
let SUB = binary (-)
let DIV = binary (/)
let NEG = unary (fun x -> -x)
let SQUARE = unary (fun x -> x*x)

let add1and2 = EMPTY |> ONE |> TWO |> ADD
let add2and3 = EMPTY |> TWO |> THREE |> ADD
let mult2and3 = EMPTY |> TWO |> THREE |> MUL
let div2by3 = EMPTY |> THREE |> TWO |> DIV
let sub2from5 = EMPTY |> TWO |> FIVE |> SUB
let neg3 = EMPTY |> THREE |> NEG
let square5 = EMPTY |> FIVE |> SQUARE

