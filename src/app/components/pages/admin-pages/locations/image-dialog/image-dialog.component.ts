import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image-service/image.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})

export class ImageDialogComponent {
  uploadedImage!: File;
  imageSelected: boolean = false;
  formData = new FormData()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private imageService: ImageService,
  private notificationService: NotificationService) { }

  uploadFile(event: any) {
    this.uploadedImage = event.target.files[0];
    this.imageSelected = true;
  }

  uploadImage() {
    const formData = new FormData();
    
    formData.append("file", this.uploadedImage);
    formData.append("id", this.data.location.locationId);
    formData.append("type", "location");

    this.imageService.uploadImage(formData).subscribe({
      next: () => {
        this.notificationService.showSuccessNotification("Image uploaded!");
      },
      error: err => {
        this.notificationService.showErrorNotification("Upload failed!");
      }
    });
  }
}
