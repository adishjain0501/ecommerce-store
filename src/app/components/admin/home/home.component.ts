import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(BaseChartDirective)chart? :BaseChartDirective
  public chartType:ChartType = 'line'; // Chart type
  public chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sale',
        data: [1000, 500, 80, 1500, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill:true,
        tension: 0.5
      },
      {
        label: 'Sale',
        data: [400, 300, 600, 200, 56, 55, 40],
        backgroundColor: '#2196F3',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill:true,
        tension: 0.5
      }
    ]
  };
  public chartOptions = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  public lineChartLegend = true;

  chartClick(event:any){
       console.log(event); 
  }

  dynamicChange(event:any){
      console.log("dynamicChange");
      this.chartData.labels.push("August");
      this.chartData.datasets.push({
        label: 'Sale',
        data: [1100, 500, 200, 1500, 56, 55, 40,1000],
        backgroundColor: 'rgba(255,100,150, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill:true,
        tension: 0.5
      });
      this.chart?.update();
  }

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  public scatterChartDatasets: ChartConfiguration<'scatter'>['data']['datasets'] = [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: -2 },
        { x: 4, y: 4 },
        { x: 5, y: -3},
      ],
      label: 'Series A',
      pointRadius: 10,
    },
  ];

  public scatterChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: false,
  };

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
  };
  public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
}
