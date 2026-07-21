// @ts-nocheck
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AlertMessageService {
  constructor() {}

  loginSuccessfulAlert() {
    Swal.fire("Good Job!", "Successfully Logged In.", "success");
  }

  successfulSubmissionAlert(title: string) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 1200,
    });
  }

  submissionErrorAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!\nPlease Try Again",
    });
  }

  submittedCredentialErrorAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Given Credentials Incorrect!\nPlease Try Again With Valid Credentials",
    });
  }

  unauthorizedRequestErrorAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your Login session Expired\nPlease Login Again",
    });
  }

  deleteItemAlert() {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  confirmStatusChangeAlert(statusName: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to change the status to "${statusName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  warningAlert(message: string) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#fff3cd",
      iconColor: "#856404",
    });
  }

  successToast(message: string) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#d4edda",
      iconColor: "#155724",
    });
  }

  errorToast(message: string) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f8d7da",
      iconColor: "#721c24",
    });
  }

  confirmEmployeeStatusChangeAlert(statusName: string, employeeName: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to ${statusName} "${employeeName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  confirmClientStatusChangeAlert(statusName: string, clientName: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to ${statusName} "${clientName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  confirmItemStatusChangeAlert(statusName: string, itemName: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to ${statusName} "${itemName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }
}
