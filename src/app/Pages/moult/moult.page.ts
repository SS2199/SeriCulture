import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../services/date.service';
import { addDays, format } from 'date-fns';

interface StageDetails {
  Stage: string;
  feedDays: string;
  disinfectant: string;
  startBedSize: string;
  endBedSize: string;
  detailAge: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-moult',
  templateUrl: './moult.page.html',
  styleUrls: ['./moult.page.scss'],
})
export class MoultPage implements OnInit {
  selectedStage: string = '';
  selectedDate: string = '';
  stages: StageDetails[] = [];
  retrievedData: any[] = [];
  selectedLanguage: string = 'english'; // Default language
  dataLoaded: boolean = false;
  storedDate: any;
  selectedDay: any;
  
  
  // English labels
  englishLabels = {
    stage: 'Stage',
    stages: 'Stages',
    startBedSize: 'Start Bed Size',
    disinfectant: 'Disinfectant',
    startDate: 'Start Date',
    endDate: 'End Date',
    endBedSize: 'End Bed Size',
    detailAge: 'Detail Age',
    feedDays: 'Feed Days',
  };

  // Tamil labels
  tamilLabels = {
    stage: 'படிமம்',
    stages: 'படிப்புகள்',
    startBedSize: 'தொடக்க படுக்கை அளவு',
    disinfectant: 'மொல்ட் பிறகு கிருமி நாசனி',
    startDate: 'தொடக்க தேதி',
    endDate: 'கடைசி தேதி',
    endBedSize: 'இறுதி படுக்கை அளவு',
    detailAge: 'விவரம்/வயது',
    feedDays: 'உணவு அளிக்கும் நாட்கள்',
  };
 

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    this.fetchStages();
    this.fetchData();
    this.retrieveStoredDate();
  }
  fetchData(): void {
    let dataObservable;

    if (this.selectedLanguage === 'english') {
      dataObservable = this.dateService.getEnglishData('english');
    } else if (this.selectedLanguage === 'tamil') {
      dataObservable = this.dateService.getTamilData('tamil');
    } else {
      // Handle other language cases or set a default behavior
      return;
    }

    dataObservable.subscribe(
      (data) => {
        this.retrievedData = data;
        this.dataLoaded = true;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  onSelectLanguage(): void {
    this.fetchData(); // Fetch data again when language changes
  }

  getLabels(): any {
    return this.selectedLanguage === 'tamil' ? this.tamilLabels : this.englishLabels;
  }
  
  fetchStages(): void {
    // Fetch stages data from your backend API
    this.dateService.getStages().subscribe(
      (data: StageDetails[]) => {
        this.stages = data;
      },
      (error) => {
        console.error('Error fetching stages:', error);
      }
    );
  }

  calculateDates(): void {
    const stageData = this.stages.find((stage) => stage.feedDays === this.selectedStage);
    if (stageData && this.selectedDate) {
      const feedDays = parseInt(stageData.feedDays, 10);
  
      const startDate = new Date(this.selectedDate);
      const endDate = new Date(startDate.getTime() + feedDays * 24 * 60 * 60 * 1000);
  
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
  
      stageData.startDate = formattedStartDate;
      stageData.endDate = formattedEndDate;
  
      // Update the UI for the selected stage
      this.retrievedData = this.retrievedData.map((item) => {
        if (item.feedDays === this.selectedStage) {
          item.startDate = formattedStartDate;
          item.endDate = formattedEndDate;
        }
        return item;
      });
  
      // Save the selected start date
      this.dateService.saveSelectedDate(formattedStartDate).subscribe(
        (response) => {
          console.log('Date saved successfully:', response);
        },
        (error) => {
          console.error('Error saving date:', error);
        }
      );
    }
  }
  
  retrieveStoredDate(): void {
    this.dateService.getStoredDate().subscribe(
      (data) => {
        this.storedDate = data;
        // Do something with the retrieved date
        console.log('Stored Date:', this.storedDate);
      },
      (error) => {
        console.error('Error occurred while fetching stored date:', error);
      }
    );
  }
  reloadStoredDateInSelectedDate(): void {
    if (this.storedDate) {
      this.loadDataForSelectedDate(this.storedDate);
    } else {
      console.error('Stored date is not available.');
    }
  }

  loadDataForSelectedDate(date: any): void {
    this.dateService.getDataForDate(date).subscribe(
      (data) => {
        // Handle the fetched data according to your application's requirements
        console.log('Data loaded for selected date:', data);
        // Perform necessary actions with the loaded data
      },
      (error) => {
        console.error('Error fetching data for selected date:', error);
        // Handle errors while fetching data
      }
    );
  }
  
}
