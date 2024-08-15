import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EvaluationCriteria } from 'src/app/pages/admin/campaigns/evaluation-team/evaluation-team.component';

@Injectable({
  providedIn: 'root'
})
export class EvaluationDataService {

  private evaluationDataSubject = new BehaviorSubject<EvaluationCriteria[]>([]);
  evaluationData$ = this.evaluationDataSubject.asObservable();

  constructor() {}

  setEvaluationData(data: EvaluationCriteria[]): void {
    this.evaluationDataSubject.next(data);
  }

  getEvaluationData(): EvaluationCriteria[] {
    return this.evaluationDataSubject.getValue();
  }

  saveEvaluationData(data: EvaluationCriteria[]): void {
    // Convert data to JSON string
    const jsonData = JSON.stringify(data);
    // Save data to local storage
    localStorage.setItem('evaluationData', jsonData);
  }
}
