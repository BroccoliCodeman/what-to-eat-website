import { Component, OnInit } from '@angular/core';
import { ModelService } from '../services/model.service';
import { ModelStatus } from '../interfaces/model-status.interface';

@Component({
  selector: 'app-model-status',
  templateUrl: './model-status.component.html',
  styleUrls: ['./model-status.component.css']
})
export class ModelStatusComponent implements OnInit {
  statusData: ModelStatus | null = null;
  isLoading = true;
  lastUpdated: Date = new Date();

  constructor(private modelService: ModelService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus() {
    this.isLoading = true;
    this.modelService.getModelStatus().subscribe({
      next: (data) => {
        this.statusData = data;
        this.isLoading = false;
        this.lastUpdated = new Date();
      },
      error: (err) => {
        console.error('Error fetching status', err);
        this.isLoading = false;
      }
    });
  }
}