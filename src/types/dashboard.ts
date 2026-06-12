export interface DashboardStats {
  totalPatients:number
  newPatientsLast30Days:number
  newPatientsLast24Hours:number
  activePatients:number
  totalRevenue:number
}


export interface Appointment {

  id:string

  patient:{
    fullName:string
    phone:string
  }

  doctor:{
    fullName:string
  }

  timeSlot:string

  status:
  | "Confirmed"
  | "Pending"
  | "In Progress"

}