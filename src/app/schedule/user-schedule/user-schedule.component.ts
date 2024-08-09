import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css'],
})
export class UserScheduleComponent implements OnInit {
  groupsData: any[] = [];
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    this.renderSearchHistory();
  }

  saveSearchToLocalStorage(value: string): void {
    let searchHistory = JSON.parse(
      localStorage.getItem('search-history') || '[]'
    ) as string[];
    if (!searchHistory.includes(value)) {
      searchHistory.unshift(value);
      if (searchHistory.length > 4) {
        searchHistory.pop();
      }
      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    }
  }

  renderSearchHistory(): void {
    const searchHistory = JSON.parse(
      localStorage.getItem('search-history') || '[]'
    ) as string[];
    const searchHistoryElement = document.getElementById('searchHistory');
    if (searchHistoryElement) {
      searchHistoryElement.innerHTML = '';
      searchHistory.forEach((item: string) => {
        const button = document.createElement('button');
        button.classList.add('story');
        button.textContent = item;
        button.addEventListener('click', () => {
          this.router.navigate(['/schedule'], { queryParams: { group: item } });
        });
        searchHistoryElement.appendChild(button);
      });
    }
  }

  onSearch(): void {
    const searchInput = this.searchForm.get('searchInput')?.value;
    if (searchInput) {
      this.saveSearchToLocalStorage(searchInput);
      this.renderSearchHistory();
      this.router.navigate(['/schedule'], {
        queryParams: { group: searchInput },
      });
    }
  }
}
