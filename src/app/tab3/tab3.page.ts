import { Component, OnInit } from '@angular/core';
import { PriceService } from '../../services/price.service';
import { DateService } from '../../services/date.service';
import Chart from 'chart.js/auto';

interface Price {
Quantity: any;
  Breed: string;
  Location: string;
  Date: string;
  Min_Price: string;
  Max_Price: string;
  Avg_Price: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  prices: Price[] = [];
  displayedPrices: Price[] = [];
  allPrices: Price[] = [];
  breeds: string[] = [];
  locations: string[] = [];
  selectedBreed: string = 'All';
  selectedLocation: string = '';
  selectedDate: string = '';

  constructor(
    private priceService: PriceService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.priceService.getPrices().subscribe(
      (price: any) => {
        this.prices = price;
        this.allPrices = price;
        this.displayedPrices = this.prices.slice(0, 10);
        this.breeds = this.getUniqueValues('Breed');
        this.breeds.unshift('All');
        this.locations = this.getUniqueValues('Location');
        this.createChart();
      },
      (error: any) => {
        console.error('Error fetching prices:', error);
        // Handle error scenario
      }
    );

    this.loadSelectedLocation();
  }

  saveSelectedLocation() {
    this.dateService.saveSelectedLocations(this.selectedLocation).subscribe(
      (response: any) => {
        console.log('Selected location saved successfully:', response);
        // Handle successful response here
      },
      (error: any) => {
        console.error('Error saving selected location:', error);
        // Handle error scenario
      }
    );
  }
  
  
  loadSelectedLocation() {
    this.dateService.getSelectedLocations().subscribe(
      (savedLocation: any) => this.handleSelectedLocation(savedLocation),
      (error: any) => this.handleErrorLoadingLocation(error)
    );
  }
  
  private handleSelectedLocation(savedLocation: any) {
    if (savedLocation) {
      this.selectedLocation = savedLocation;
      this.filterData();
      console.log('Selected location loaded:', this.selectedLocation);
    }
  }
  
  private handleErrorLoadingLocation(error: any) {
    console.error('Error loading selected location:', error);
    // Handle error scenario
  }
  

  getUniqueValues(key: keyof Price): string[] {
    const uniqueValues: string[] = [];
    if (this.prices) {
      this.prices.forEach((price: Price) => {
        // Check if the key exists in the Price object before accessing it
        if (key in price && typeof price[key] === 'string' && !uniqueValues.includes(price[key])) {
          uniqueValues.push(price[key]);
        }
      });
    }
    return uniqueValues;
  }
  
  filterData() {
    if (this.allPrices) {
      if (this.selectedBreed === 'All') {
        // If 'All' is selected, display all data
        this.displayedPrices = this.allPrices;
      } else {
        // Filter data based on selected breed, location, and date
        this.displayedPrices = this.allPrices.filter((price: Price) => {
          const matchBreed = this.selectedBreed === 'All' || price.Breed === this.selectedBreed;
          const matchLocation = this.selectedLocation === 'All' || price.Location === this.selectedLocation;
          const matchDate = this.selectedDate === '' || price.Date === this.selectedDate;

          return matchBreed && matchLocation && matchDate;
        });
      }

      this.createChart();
    } else {
      console.error('this.allPrices is undefined or null.');
      // Handle the case where this.allPrices is undefined or null
    }
  }

  createChart() {
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;

    const breedLabels = this.displayedPrices.map((price: Price) => `${price.Breed} - ${price.Location}`);
    const minPrices = this.displayedPrices.map((price: Price) => parseFloat(price.Min_Price.replace('₹', '')));
    const maxPrices = this.displayedPrices.map((price: Price) => parseFloat(price.Max_Price.replace('₹', '')));
    const avgPrices = this.displayedPrices.map((price: Price) => parseFloat(price.Avg_Price.replace('₹', '')));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: breedLabels,
        datasets: [
          {
            label: 'Min Price',
            data: minPrices,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Max Price',
            data: maxPrices,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
          {
            label: 'Avg Price',
            data: avgPrices,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    });
  }
}
