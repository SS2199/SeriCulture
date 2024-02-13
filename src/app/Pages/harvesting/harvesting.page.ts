import { Component } from '@angular/core';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-harvesting',
  templateUrl: './harvesting.page.html',
  styleUrls: ['./harvesting.page.scss'],
})
export class HarvestingPage {
  selectedLanguage: string = 'en'; // Default language
  translatedText: string = '';

  constructor(private translationService: TranslationService) { }

changeLanguage() {
  // Translate some example text (e.g., "Hello, world!") to demonstrate dynamic translation
  const exampleText = 'Hello, world!';
  this.translationService.translateText(exampleText, this.selectedLanguage)
    .subscribe(translatedText => {
      this.translatedText = translatedText;
    });
}
}

