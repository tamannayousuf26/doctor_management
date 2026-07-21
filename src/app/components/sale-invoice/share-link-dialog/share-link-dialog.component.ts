import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-share-link-dialog",
  templateUrl: "./share-link-dialog.component.html",
  styleUrls: ["./share-link-dialog.component.scss"],
})
export class ShareLinkDialogComponent {
  copied = false;
  whatsappNumber = "";

  constructor(
    public dialogRef: MatDialogRef<ShareLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { link: string }
  ) {}

  copyLink(): void {
    navigator.clipboard.writeText(this.data.link).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }

  shareOnWhatsApp(): void {
    // Remove any non-digit characters from the phone number
    const phoneNumber = this.whatsappNumber.replace(/\D/g, "");

    if (!phoneNumber) {
      alert("Please enter a WhatsApp number");
      return;
    }

    // Create the WhatsApp message
    const message = encodeURIComponent(
      `Here is the Invoice Report Link:\n\n${this.data.link}`
    );

    // WhatsApp URL - works on both desktop (opens WhatsApp Web) and mobile (opens WhatsApp app)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in a new window
    window.open(whatsappUrl, "_blank");
  }

  close(): void {
    this.dialogRef.close();
  }
}
