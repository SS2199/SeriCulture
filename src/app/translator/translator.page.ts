import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date.service';

interface StageDetails {
  isTracked: boolean;
  count: number;
  calculatedEndBedSize: any;
  calculatedStartBedSize: any;
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
  selector: 'app-translator',
  templateUrl: './translator.page.html',
  styleUrls: ['./translator.page.scss'],
})
export class TranslatorPage implements OnInit {
  
  activeTab: string = 'day1'; 
  selectedDay: any;
  retrievedData: any[] = [];
  selectedLanguage: string = 'english'; // Default language
  dataLoaded: boolean = false;
  selectedStage: string = '';
  selectedDate: string = '';
  stages: StageDetails[] = [];
  count: number = 0;

// English labels
  englishLabels = {
    stage: 'Stage',
    stages: 'Stages',
    startBedSize: 'Start Bed Size',
    disinfectant: 'Disinfectant',
    endBedSize: 'End Bed Size',
    detailAge: 'Detail Age',
    feedDays: 'Feed Days',
    selection: 'Day Selection'
  };

  // Tamil labels
  tamilLabels = {
    stage: 'படிமம்',
    stages: 'படிப்புகள்',
    startBedSize: 'தொடக்க படுக்கை அளவு',
    disinfectant: 'மொல்ட் பிறகு கிருமி நாசனி',
    endBedSize: 'இறுதி படுக்கை அளவு',
    detailAge: 'விவரம்/வயது',
    feedDays: 'உணவு அளிக்கும் நாட்கள்',
    selection: 'நாள் தேர்வு',
  };
item: any;


  constructor(private dateService: DateService) { }
  
  ngOnInit(): void {
    this.fetchData();
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

 
onCountChange(): void {
  // Loop through all retrievedData items and update calculated values
  for (let item of this.retrievedData) {
    const count = Number(this.count);

    if (!isNaN(count)) {
      const startBedSize = parseInt(item.startBedSize, 10);
      const endBedSize = parseInt(item.endBedSize, 10);

      // Calculate start and end bed sizes based on the count
      const calculatedStartBedSize = startBedSize + count;
      const calculatedEndBedSize = endBedSize + count;

      // Update the item with calculated values
      item.calculatedStartBedSize = calculatedStartBedSize.toString();
      item.calculatedEndBedSize = calculatedEndBedSize.toString();
    } else {
      // Handle invalid input (non-numeric count)
      // You may want to display an error message or handle it as needed
    }
  }
  
}


onDragStart(event: DragEvent) {
  // Implement your drag start logic here
  console.log('Drag started');
}

toggleStage(item: any) {
  // Implement your toggle stage logic here
  item.isExpanded = !item.isExpanded;
}

calculateTrackedStatus(): void {
  const selectedDate = new Date(this.selectedDate);

  let isFirstStage = true;

  this.retrievedData.forEach((stage, index) => {
    const startDate = new Date(stage.startDate);
    const endDate = new Date(stage.endDate);

    stage.isTracked = selectedDate >= startDate && selectedDate <= endDate;

    if (isFirstStage && stage.isTracked) {
      stage.isVisible = true;
      isFirstStage = false;
    } else {
      stage.isVisible = false;
    }

    if (!isFirstStage && index > 1 && this.retrievedData[index - 1].isTracked) {
      stage.isVisible = stage.isTracked;
    }
  });
}


  
calculateDates(): void {
  const selectedDate = new Date(this.selectedDate);

  this.retrievedData.forEach((stage) => {
    const startDate = new Date(stage.startDate);
    const endDate = new Date(stage.endDate);

    stage.isVisible = selectedDate >= startDate && selectedDate <= endDate;
  });

  // Save the selected start date
  this.dateService.saveSelectedDate(selectedDate.toISOString().split('T')[0]).subscribe(
    (response) => {
      console.log('Date saved successfully:', response);
    },
    (error) => {
      console.error('Error saving date:', error);
    }
  );
}


}
