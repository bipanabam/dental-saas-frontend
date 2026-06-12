"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"


const Form = FormProvider

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues,TName>) => {

  return (
    <Controller {...props}/>
  )
}


const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
({className,...props},ref)=>(
  <div
    ref={ref}
    className={cn(
      "space-y-2",
      className
    )}
    {...props}
  />
))

FormItem.displayName="FormItem"



const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(
({className,...props},ref)=>(
  <Label
    ref={ref}
    className={className}
    {...props}
  />
))

FormLabel.displayName="FormLabel"



function useFormField(){

  const {
    getFieldState,
    formState
  } = useFormContext()


  const fieldState =
    getFieldState(
      "",
      formState
    )


  return {
    error: fieldState.error
  }

}



const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
({children,...props},ref)=>(
  <div
    ref={ref}
    {...props}
  >
    {children}
  </div>
))


FormControl.displayName="FormControl"



function FormMessage(){

    const {error}=useFormField();

    if(!error?.message)
    return null

    return (

    <p className="text-sm text-destructive">
        {String(error.message)}
    </p>
    
)}



export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
}