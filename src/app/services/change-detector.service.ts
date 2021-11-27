import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Enum} from '../enums/enums';
import { hardObjectClone } from '../utils/helper';

export abstract class DataStoreDetector<T, W extends Enum> {

  private dataChangeSubject: BehaviorSubject<{ action: W, payload: T }>;
  private dataChangeEvent$: Observable<{ action: W, payload: T }>;

  constructor() {
  }

  public initializeDataChanges(): void {
      if (!this.dataChangeSubject || this.dataChangeSubject.isStopped) {
          this.dataChangeSubject = new BehaviorSubject({ action: null, payload: null });
          this.dataChangeEvent$ = this.dataChangeSubject.asObservable();
      }
  }

  public compleDataChanges(): void {
      this.dataChangeSubject.complete();
  }

  public resetDataChanges(): void {
      if (this.dataChangeSubject !== null) this.compleDataChanges();
      else this.initializeDataChanges();
  }

  public getDataChanges(): Observable<{ action: W, payload: T }> {
      return this.dataChangeEvent$.pipe(filter(tt => tt.action !== null));
  }

  public getDataChangesValues() {
      return this.dataChangeSubject.getValue();
  }

  protected updateDataChanges(dataChangeEntries: { action: W, payload: T }): void {
      this.dataChangeSubject.next(dataChangeEntries);
  }

  protected getClonedDataChange(): T {
      var storeValue = this.dataChangeSubject.getValue();
      return hardObjectClone(storeValue.payload) as T;
  }
}

