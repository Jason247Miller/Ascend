import { HttpClientXsrfModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})
export class ReportsComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) canvasRef: ElementRef;
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  myChart!: Chart;
  labelsLink!:string[]; 
  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');
    this.labelsLink =  ['https://www.google.com/', 'https://www.google.com/', 'https://www.google.com/',
     'https://www.google.com/', 'https://www.google.com/', 'https://www.google.com/', 'https://www.google.com/'];

    if (ctx) {
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2/3', '2/4', '2/5', '2/6', '2/7', '2/8', '2/9'],
          datasets: [{
            label: 'sleep rating',
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
            label: 'overall rating',
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
        //console.log('reset', resetCoordinates)
        this.clickableScales(e, resetCoordinates);
      });
    }

  }

  clickableScales(click: MouseEvent, resetCoordinates: any) {
    console.log('canvas', this.canvas)
    console.log('click', click)
    const height = this.myChart.scales['x'].height;
    const top = this.myChart.scales['x'].top;
    const bottom = this.myChart.scales['x'].bottom;
    const left = this.myChart.scales['x'].left;
    const right = this.myChart.scales['x'].maxWidth / this.myChart.scales['x'].ticks.length;
    
    const x = click.clientX - resetCoordinates.left;
    const y = click.clientY - resetCoordinates.top;
    //console.log('x', x);
    //console.log('y', y);
    //console.log('right', right)
    //console.log('scales x' , myChart.scales['x'].top)
    for(let i = 0; i < this.myChart.scales['x'].ticks.length; i++){
  if(x >= left + (right * i) && x <= right + (right * i) && y>= top && y <= bottom){
    if(this.myChart.data.labels){
    console.log('clicked label', this.myChart.data.labels[i]);
    }

    
    
  }
}

  }




}

