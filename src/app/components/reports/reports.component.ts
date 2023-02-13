import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { take } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

Chart.register(...registerables);
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})
export class ReportsComponent implements OnInit {

  constructor(private router: Router, private accountService: AccountService) { }
  @ViewChild('chartCanvas', { static: true }) canvasRef: ElementRef;
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  myChart!: Chart;

  dates!: string[];
  startIndex: number = 0;
  yearTracker:number = 0; 
  private queryDatesArray:string[] = []; 

  
  private currentUserId!:number; 
  ngOnInit(): void {

    
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.dates = this.updateDays();
    console.log('dates', this.dates);


    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');

    if (ctx) {
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [{
            label: 'overall',
            data: [10, 9, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'sleep rating',
            data: [2, 9, 7, 5, 2, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1

          }
          ]
        },
        options: {

          scales: {
            y: {
              beginAtZero: true
            },
            x: {

            }
          }


        }
      });


      //myChart.setDatasetVisibility(1, false);

      this.canvas.addEventListener('click', (e: MouseEvent) => {
        let resetCoordinates = this.canvas.getBoundingClientRect();
        this.clickableScales(e, resetCoordinates);

      });
    }

  }

  clickableScales(click: MouseEvent, resetCoordinates: any) {
   
    const top = this.myChart.scales['x'].top;
    const bottom = this.myChart.scales['x'].bottom;
    const left = this.myChart.scales['x'].left;
    const right = this.myChart.scales['x'].maxWidth / this.myChart.scales['x'].ticks.length + 1.5 ;
    const x = click.clientX - resetCoordinates.left;
    const y = click.clientY - resetCoordinates.top;

    for (let i = 0; i < this.myChart.scales['x'].ticks.length; i++) {
      if (x >= left + (right * i) && x <= right + (right * i) && y >= top && y <= bottom) {
        if (this.myChart.data.labels) {
          //let reversedDateArray = this.queryDatesArray.reverse();
          console.log('i', i); 
         console.log('reversed array', this.queryDatesArray[i]);
         console.log('labels array', this.myChart.data.labels[i])
       
          this.accountService.getWellnessEntryByDate( this.queryDatesArray[i], this.currentUserId,)
          .pipe(take(1))
          .subscribe(entriesForDate => {
            //if rating entries exist for current date
            if (entriesForDate.length !== 0) {
              this.router.navigate(['dashboard/daily-review', this.queryDatesArray[i]])
              console.log("entry already exist");
             
            } else {
              console.log("currentdate entry does not exist");

            }
          });
         
         
          //in the backend, use the date to query the form entries for that date. 
          //make the form inputs read only 

        }



      }
    }

  }


  updateDays(): string[] {

     let displayDateArray = [];
     this.queryDatesArray = []; 

    for (let i = this.startIndex; i < this.startIndex + 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const chartDateString = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit"

      });
        let queryDateString = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year:"numeric"
      });
      queryDateString = queryDateString.replace(/(\d+)\/(\d+)\/(\d+)/, "$1-$2-$3"); 
      
      this.queryDatesArray.push(queryDateString);
   
      console.log('query string', this.queryDatesArray);
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
    this.myChart.update(); 
    console.log('NEXT dates', this.dates);
    }
    else if (this.startIndex === 0) {
      console.log('current date');
      return;
    }


  }

  previousWeek() {

    this.startIndex = this.startIndex + 7;
    this.myChart.data.labels = [];
    this.myChart.data.labels = this.updateDays();
    this.myChart.update(); 
    console.log('next dates', this.dates);
  }

}

