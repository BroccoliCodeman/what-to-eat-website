import { Component, OnInit, HostListener } from '@angular/core';
import { ModelService } from '../services/model.service';
import { PoolItem } from '../interfaces/active-learning.interface';

// Інтерфейс для елемента історії
interface HistoryItem {
  poolItem: PoolItem;
  label: string;
  timestamp: Date;
}

@Component({
  selector: 'app-active-learning',
  templateUrl: './active-learning.component.html',
  styleUrls: ['./active-learning.component.css']
})
export class ActiveLearningComponent implements OnInit {
  poolItems: PoolItem[] = [];
  availableClasses: string[] = [];
  
  // Історія пролейблованих елементів
  labeledHistory: HistoryItem[] = [];

  // Змінні для пошуку
  filteredClasses: string[] = [];
  openDropdownId: string | null = null;
  searchTerm: string = '';

  isLoading = false;
  retrainStatus: string = '';
  isRetraining = false;

  constructor(private modelService: ModelService) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadPool();
  }

  // ... (loadClasses, loadPool, getImgUrl, triggerRetrain - БЕЗ ЗМІН) ...

  loadClasses() {
    this.modelService.getClasses().subscribe({
      next: (res) => {
        this.availableClasses = res.classes;
        this.filteredClasses = res.classes;
      }
    });
  }

  loadPool() {
    this.isLoading = true;
    this.modelService.getUncertainPool(20).subscribe({
      next: (res) => {
        this.poolItems = res.items;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getImgUrl(relativePath: string): string {
    return this.modelService.getImageUrl(relativePath);
  }

triggerRetrain() {
    // 1. Питаємо підтвердження, щоб не запустити випадково
    if (!confirm('Ви впевнені, що хочете запустити процес донавчання моделі? Це може зайняти певний час.')) {
      return;
    }

    // 2. Вмикаємо статус завантаження
    this.isRetraining = true;
    this.retrainStatus = 'Запуск процесу донавчання...';

    // 3. Викликаємо сервіс
    this.modelService.triggerRetraining().subscribe({
      next: (res) => {
        // Успішна відповідь
        this.isRetraining = false;
        // res.message та res.samples_count приходять з твого Python RetrainResponse
        this.retrainStatus = `Успіх! ${res.message}. Використано семплів: ${res.samples_count}`;
        alert(this.retrainStatus);
      },
      error: (err) => {
        // Помилка
        this.isRetraining = false;
        console.error('Retrain error:', err);
        
        // Якщо сервер повернув повідомлення про помилку, показуємо його
        const errorMsg = err.error?.detail || err.message || 'Невідома помилка';
        this.retrainStatus = `Помилка при запуску донавчання: ${errorMsg}`;
        alert(this.retrainStatus);
      }
    });
  }

  // --- ЛОГІКА ПРОПУСКУ (SKIP) ---
  skipItem(item: PoolItem, event: Event) {
    event.stopPropagation(); // Щоб не спрацювали інші кліки
    this.removeItemFromList(item.id);
  }

  removeItemFromList(id: string) {
    this.poolItems = this.poolItems.filter(x => x.id !== id);
  }

  // --- ЛОГІКА ПОШУКУ (з попередньої відповіді) ---
  openDropdown(item: PoolItem, event: Event) {
    event.stopPropagation();
    this.openDropdownId = item.id;
    this.searchTerm = '';
    this.filteredClasses = this.availableClasses;
  }

  onSearchChange(text: string) {
    this.searchTerm = text;
    const lowerText = text.toLowerCase();
    this.filteredClasses = this.availableClasses.filter(c => 
      c.toLowerCase().includes(lowerText)
    );
  }

  selectClass(item: PoolItem, selectedClass: string) {
    this.openDropdownId = null;
    this.submitCorrection(item, selectedClass);
  }

  @HostListener('document:click')
  closeDropdown() {
    this.openDropdownId = null;
  }

  // --- ВІДПРАВКА + ДОДАВАННЯ В ІСТОРІЮ ---
  submitCorrection(item: PoolItem, selectedClass: string) {
    if (!selectedClass) return;

    // 1. Прибираємо зі списку активних
    this.removeItemFromList(item.id);

    // 2. Додаємо в історію (на початок масиву)
    this.labeledHistory.unshift({
      poolItem: item,
      label: selectedClass,
      timestamp: new Date()
    });

    // 3. Відправляємо на сервер
    this.modelService.submitFeedback(item.id, selectedClass).subscribe({
      next: (res) => {
        console.log(`Feedback accepted for ${item.id}`);
        if (this.poolItems.length === 0) this.loadPool();
      },
      error: (err) => {
        console.error('Feedback failed', err);
        // Опціонально: можна повернути елемент назад у список або показати помилку в історії
      }
    });
  }
}