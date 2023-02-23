import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartData, registerables } from 'chart.js';
import { take } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

Chart.register(...registerables);
@Component({selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']})
export class ReportsComponent implements OnInit {

  constructor(private router: Router, private accountService: AccountService) { }
  @ViewChild('chartCanvas', {static: true}) canvasRef: ElementRef;
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  myChart!: Chart;
  dates!: string[];
  startIndex: number = 0;
  yearTracker: number = 0;
  private queryDatesArray: string[] = [];
  private sleepRatings: (number | null)[];
  private exerciseRatings: (number | null)[];
  private nutritionRatings: (number | null)[];
  private stressRatings: (number | null)[];
  private sunlightRatings: (number | null)[];
  private mindfulnessRatings: (number | null)[];
  private productivityRatings: (number | null)[];
  private moodRatings: (number | null)[];
  private energyRatings: (number | null)[];
  private overallRatings: (number | null)[];
  private myChartData: ChartData;
  private currentUserId!: number;

  ngOnInit(): void {

    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.dates = this.updateDays();//previous 7 days by default
    this.setChartData(); 
    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');

    this.myChartData = {labels: this.dates,
      datasets: []};

    if (ctx) {
      this.myChart = new Chart(ctx, {type: 'bar',
        data: this.myChartData,
        options: {maintainAspectRatio:false,
          scales: {y: {beginAtZero: true,},
            x: {ticks: {color: "purple",
                font: {size: 14}}}},}});

      //redirects to journal entry with the date of the clicked X-Axis Label
      this.canvas.addEventListener('click', (clickEvent: MouseEvent) => {
        let resetCoordinates = this.canvas.getBoundingClientRect();
        this.clickableScales(clickEvent, resetCoordinates);

      });
      
      //change pointer to cursor onHover of X-Axis labels
      this.canvas.addEventListener('mousemove', (mouseMoveEvent: MouseEvent) => {
        let resetCoordinates = this.canvas.getBoundingClientRect();
        this.clickableScales(mouseMoveEvent, resetCoordinates);
      });
    }

  }

  clickableScales(mouseEvent: MouseEvent, resetCoordinates: DOMRect) {
    this.canvas.style.cursor = 'default';

    //get the furthest point for all sides of graph
    const top = this.myChart.scales['x'].top;
    const bottom = this.myChart.scales['x'].bottom;
    const left = this.myChart.scales['x'].left;
    const right = this.myChart.scales['x'].maxWidth / this.myChart.scales['x'].ticks.length + 1.5;

    //substract outer margin to get accurate x and y coordinates for the graph part of the canvas
    const x = mouseEvent.clientX - resetCoordinates.left;
    const y = mouseEvent.clientY - resetCoordinates.top;
  
    for (let i = 0; i < this.myChart.scales['x'].ticks.length; i++) {
      if (x >= left + (right * i) && x <= right + (right * i) && y >= top && y <= bottom) {
       this.canvas.style.cursor = 'pointer';
        if (this.myChart.data.labels && mouseEvent.type === 'click') {
          this.accountService.getWellnessEntryByDate(this.queryDatesArray[i], this.currentUserId,)
            .pipe(take(1))
            .subscribe(entriesForDate => {
              //if rating entries exist for current date
              if (entriesForDate.length !== 0) {
                this.router.navigate(['dashboard/daily-review', this.queryDatesArray[i]])
              }
           });
        }
      }
    }
  }

  updateDays(): string[] {

    let displayDateArray = [];
    this.queryDatesArray = []; //logs full date for db query

    for (let i = this.startIndex; i < this.startIndex + 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const chartDateString = date.toLocaleDateString("en-US", {month: "2-digit",
        day: "2-digit"});
      let queryDateString = date.toLocaleDateString("en-US", {month: "2-digit",
        day: "2-digit",
        year: "numeric"});
      queryDateString = queryDateString.replace(/(\d+)\/(\d+)\/(\d+)/, "$1-$2-$3");
      this.queryDatesArray.push(queryDateString);
      displayDateArray.push(chartDateString);
    }
    this.queryDatesArray.reverse();
    return displayDateArray.reverse();
  };

  nextWeek() {

    if (this.startIndex > 0) {
      this.startIndex = this.startIndex - 7;
      this.myChart.data.labels = [];
      this.myChart.data.labels = this.updateDays();
      this.setChartData();
    }
    else if (this.startIndex === 0) {return;}
  }
  previousWeek() {

    this.startIndex = this.startIndex + 7;
    this.myChart.data.labels = [];
    this.myChart.data.labels = this.updateDays();
    this.setChartData();
  }
  setChartData() {
    //initialize with 7 elements to keep index integrity 
    this.sleepRatings = [null, null, null, null, null, null, null];
    this.exerciseRatings = [null, null, null, null, null, null, null];
    this.nutritionRatings = [null, null, null, null, null, null, null];
    this.stressRatings = [null, null, null, null, null, null, null];
    this.sunlightRatings = [null, null, null, null, null, null, null];
    this.mindfulnessRatings = [null, null, null, null, null, null, null];
    this.productivityRatings = [null, null, null, null, null, null, null];
    this.moodRatings = [null, null, null, null, null, null, null];
    this.energyRatings = [null, null, null, null, null, null, null];
    this.overallRatings = [null, null, null, null, null, null, null];
    
    //used for http get
    let oldestDate = new Date(this.queryDatesArray[0]);
    let latestDate = new Date(this.queryDatesArray[this.queryDatesArray.length - 1]);

    this.accountService.getWellnessEntriesInDateRange(oldestDate, latestDate, this.currentUserId)
      .pipe(take(1))
      .subscribe((wellnessRatings) => {

        for (let i = 0; i < this.queryDatesArray.length; i++) {

          for (let z = 0; z < wellnessRatings.length; z++) {

            if (this.queryDatesArray[i] === wellnessRatings[z].date) {
              this.sleepRatings[i] = wellnessRatings[z].sleepRating;
              this.exerciseRatings[i] = wellnessRatings[z].exerciseRating;
              this.nutritionRatings[i] = wellnessRatings[z].nutritionRating;
              this.stressRatings[i] = wellnessRatings[z].stressRating;
              this.sunlightRatings[i] = wellnessRatings[z].sunlightRating;
              this.mindfulnessRatings[i] = wellnessRatings[z].mindfulnessRating;
              this.productivityRatings[i] = wellnessRatings[z].productivityRating;
              this.moodRatings[i] = wellnessRatings[z].moodRating;
              this.energyRatings[i] = wellnessRatings[z].energyRating;
              this.overallRatings[i] = wellnessRatings[z].overallDayRating;
            }
          }

        }
        this.myChart.data.datasets = [];
        this.myChart.data.datasets.push(
          {label: 'Sleep',
            data: this.sleepRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)'
            ],
            borderColor: [
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)',
              'rgba(169, 0, 110, 1)'
            ],       
            borderWidth: 1}
        )
        this.myChart.data.datasets.push(

          {label: 'Exercise',
            data: this.exerciseRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)'
            ],
            borderColor: [
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)',
              'rgba(0, 99, 255, 1)'
            ],
            borderWidth: 1}
        );
        this.myChart.data.datasets.push(

          {label: 'Nutrition',
            data: this.nutritionRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)'
            ],
            borderColor: [
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)',
              'rgba(237, 155, 189, 1)'
            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Stress',
            data: this.stressRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)'
            ],
            borderColor: [
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(0, 0, 0, 1)'
            ],
            borderWidth: 1});

        this.myChart.data.datasets.push(

          {label: 'Sunlight',
            data: this.sunlightRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)'

            ],
            borderColor: [
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)',
              'rgba(198, 254, 42, 1)'

            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Mindfulness',
            data: this.mindfulnessRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)'
            ],
            borderColor: [
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)',
              'rgba(0, 184, 7, 1)'
            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Productivity',
            data: this.productivityRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)'
            ],
            borderColor: [
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)',
              'rgba(206, 5, 5, 1)'
            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Mood',
            data: this.moodRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)'
            ],
            borderColor: [
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)',
              'rgba(126, 74, 74, 1)'
            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Energy',
            data: this.energyRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)'
            ],
            borderColor: [
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)',
              'rgba(132, 143, 82, 1)'
            ],
            borderWidth: 1});
        this.myChart.data.datasets.push(

          {label: 'Overall',
            data: this.overallRatings,
            spanGaps: true,
            backgroundColor: [
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)'
            ],
            borderColor: [
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)',
              'rgba(255, 167, 0, 1)'
            ],
            borderWidth: 1});

        this.myChart.update();
      });

  }

}

