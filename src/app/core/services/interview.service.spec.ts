import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InterviewService, InterviewFilters } from './interview.service';
import { Interview } from '../models/interview.model';

describe('InterviewService', () => {
  let service: InterviewService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterviewService]
    });

    service = TestBed.inject(InterviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch interviews', () => {
    const dummyInterviews: Interview[] = [
      { id: 1, interviewDay: 'Interview Day 1' },
      { id: 2, interviewDay: 'Interview Day 2' }
    ];

    const page = 1;
    const limit = 10;
    const filters: InterviewFilters = { interviewDay: 'test', isActive: true };

    service.getInterviews(page, limit, filters).subscribe((interviews: Interview[]) => {
      expect(interviews.length).toBe(2);
      expect(interviews).toEqual(dummyInterviews);
    });

    const req = httpTestingController.expectOne(req => {
      return (
        req.url === 'interview' &&
        req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('interviewDay') === 'test' &&
        req.params.get('isActive') === 'true'
      );
    });

    req.flush(dummyInterviews);
  });

  it('should add an interview', () => {
    const newInterview: Interview = { id: 3, interviewDay: 'New Interview Day' };

    service.addInterview(newInterview).subscribe((interview: Interview) => {
      expect(interview).toEqual(newInterview);
    });

    const req = httpTestingController.expectOne('interview');
    expect(req.request.method).toBe('POST');
    req.flush(newInterview);
  });

  it('should update an interview', () => {
    const updatedInterview: Interview = { id: 2, interviewDay: 'Updated Interview Day' };

    service.updateInterview(2, updatedInterview).subscribe((interview: Interview) => {
      expect(interview).toEqual(updatedInterview);
    });

    const req = httpTestingController.expectOne('interview/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedInterview);
  });

  it('should fetch candidate interview data', () => {
    const interviewId = 123;
    const dummyData = {};

    service.getCandidateInterviewData(interviewId).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpTestingController.expectOne(`interview/candidate-interview/${interviewId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should fetch all candidate interview data', () => {
    const page = 1;
    const limit = 10;
    const filters: InterviewFilters = { isActive: true };

    const dummyData = { };

    service.getAllCandidateInterviewData(page, limit, filters).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpTestingController.expectOne(req => {
      return (
        req.url === 'interview/candidate-interviews' &&
        req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('isActive') === 'true'
      );
    });

    req.flush(dummyData);
  });

  it('should fetch interview data', () => {
    const interviewId = 123;
    const userId = 456;

    const dummyData = { };

    service.getInterviewData(interviewId, userId).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpTestingController.expectOne(`interview/interview-data/${interviewId}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should update interview scores and grades', () => {
    const requestData = { };

    const dummyResponse = { };

    service.updateInterviewScoresAndGrades(requestData).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne('interview/update-interview-scores-and-grades');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
