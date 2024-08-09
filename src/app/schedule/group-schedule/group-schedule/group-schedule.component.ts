import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ScheduleService } from '../../../../core/schedule/schedule.service';

@Component({
  selector: 'app-group-schedule',
  templateUrl: './group-schedule.component.html',
  styleUrls: ['./group-schedule.component.css'],
})
export class GroupScheduleComponent implements OnInit {
  searchForm: FormGroup;
  currentWeek: any;
  currentWeekDate: string = '';
  groupNumber: string = '';
  weekData: any[] = [];

  daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  timeSlots = [
    { label: '1 пара 8:30-10:05', time: '8:30' },
    { label: '2 пара 10:15-11:50', time: '10:15' },
    { label: '3 пара 12:00-13:35', time: '12:00' },
    { label: '4 пара 14:00-15:35', time: '14:00' },
    { label: '5 пара 15:45-17:20', time: '15:45' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService
  ) {
    this.searchForm = this.fb.group({
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    moment.locale('ru');
    this.currentWeek = this.getDateWeekData(moment());
    this.renderCurrentWeekDate(this.currentWeek);

    this.route.queryParams.subscribe((params) => {
      const queryGroup = params['group'];
      if (queryGroup) {
        this.groupNumber = queryGroup;
        this.findGroupAndFetchSchedule(queryGroup);
      } else {
        console.error('Group not specified in query parameters.');
      }
    });
  }

  getDateWeekData(date: moment.Moment) {
    const currentDate = moment(date);
    const year = currentDate.weekYear();
    const weekNo = currentDate.week();
    const start = currentDate.clone().startOf('isoWeek');
    const end = currentDate.clone().endOf('isoWeek');
    return { year, weekNo, start, end };
  }

  renderCurrentWeekDate(week: any) {
    this.currentWeekDate = `${week.start.format(
      'DD MMM yyyy'
    )} - ${week.end.format('DD MMM yyyy')}`;
  }

  changeWeek(diff: number) {
    this.currentWeek.start.add(diff, 'week');
    this.currentWeek = this.getDateWeekData(this.currentWeek.start);
    this.renderCurrentWeekDate(this.currentWeek);
    const queryGroup = this.route.snapshot.queryParams['group'];
    if (queryGroup) {
      this.findGroupAndFetchSchedule(queryGroup);
    }
  }

  onSearch(): void {
    const searchValue = this.searchForm.get('searchInput')?.value.trim();
    if (searchValue) {
      this.saveSearchToLocalStorage(searchValue);
      this.router.navigate(['/schedule'], {
        queryParams: { group: searchValue },
      });
    }
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

  findGroupAndFetchSchedule(groupNumber: string) {
    this.scheduleService.findGroupByNumber(groupNumber).subscribe(
      (groups) => {
        const group = groups[0];
        if (group && group.id) {
          this.fetchAndRenderSchedule(group.id);
        } else {
          console.error('Group not found with the given number.');
          document.getElementById('scheduleTable')!.textContent =
            'ГРУППА НЕ НАЙДЕНА';
        }
      },
      (error) => {
        console.error('Error finding group:', error);
        document.getElementById('scheduleTable')!.textContent =
          'ГРУППА НЕ НАЙДЕНА';
      }
    );
  }

  fetchAndRenderSchedule(groupId: number) {
    this.scheduleService
      .getSchedule(this.currentWeek.year, this.currentWeek.weekNo, groupId)
      .subscribe(
        (data) => {
          this.weekData = data;
        },
        (error) => {
          console.error('Error fetching schedule:', error);
          document.getElementById('scheduleTable')!.textContent =
            'НЕТ РАСПИСАНИЯ ДЛЯ ЭТОЙ ГРУППЫ НА ЭТУ НЕДЕЛЮ';
        }
      );
  }

  getCellContent(day: string, time: string): string {
    const entry = this.weekData.find(
      (item) =>
        this.getDayOfWeek(item.dayOfWeek) === day && item.startTime === time
    );
    return entry ? entry.subjectName : '';
  }

  getDayOfWeek(dayOfWeek: number): string {
    const days = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ];
    return days[dayOfWeek - 1] || '';
  }
}
