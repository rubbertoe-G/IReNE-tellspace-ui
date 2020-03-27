import { Injectable } from "@angular/core";
import { CaseDocument } from "@app/models/case-document";
import { Observable, of, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { ContentSection } from "@app/models/content-section";
import { Category } from "@app/models/category";

@Injectable({
  providedIn: "root"
})
export class DocumentsService {
  constructor(private http: HttpClient) {}

  private rootUrl = "api/tellspace"; // URL to web api

  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  //Route Client Functions:

  /** GET document metadata. Will 404 if there are no documents */
  public getDocuments(): Observable<CaseDocument[]> {
    const url = `${this.rootUrl}/documents`;
    return this.http
      .get<CaseDocument[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError<CaseDocument[]>("getDocuments", [])));
  }

  /** POST new document on the server */
  public createDocument(newDoc: CaseDocument): Observable<any> {
    console.log("sending create");
    const url = `${this.rootUrl}/documents/create`;
    return this.http
      .post(url, newDoc, this.httpOptions)
      .pipe(catchError(this.handleError<any>("createDocument")));
  }

  /** DELETE document on the server */
  public removeDocument(id: string): Observable<any> {
    const url = `${this.rootUrl}/documents/remove/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(_ => console.log(`removeDocument id=${id}`)),
      catchError(this.handleError<any>(`remove document id=${id}`))
    );
  }

  /** GET document by id. Will 404 if id not found */
  public getDocumentById(id: string): Observable<CaseDocument> {
    const url = `${this.rootUrl}/documents/${id}`;
    return this.http.get<CaseDocument>(url).pipe(
      tap(_ => console.log(`getDocumentByID id=${id}`)),
      catchError(this.handleError<CaseDocument>(`getDocumentById id=${id}`))
    );
  }

  /** POST new section */
  public createSection(): Observable<any> {
    const url = `${this.rootUrl}/documents/edit/section/create`;
    return this.http
      .post(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError<any>("createSection")));
  }

  /** POST remove a section */
  public removeSection(id: number): Observable<any> {
    const url = `${this.rootUrl}/documents/edit/section/remove`;
    return this.http
      .post(url, { sec_nbr: id }, this.httpOptions)
      .pipe(catchError(this.handleError<any>("deleteSection")));
  }

  /** PUT: update the document section on the server */
  public editDocumentSection(sec: ContentSection): Observable<any> {
    const url = `${this.rootUrl}/document/edit/section`;
    return this.http.put(url, sec, this.httpOptions).pipe(
      tap(_ => console.log(`edited section title=${sec.section_title}`)),
      catchError(
        this.handleError<any>(`editDocumentSection title=${sec.section_title}`)
      )
    );
  }

  /** PUT: edit document metadata on the server
   * @argument type document field to edit on the server.
   */
  public edit(type: string, body: any): Observable<any> {
    const url = `${this.rootUrl}/documents/edit/${type}`;
    return this.http.put(url, body, this.httpOptions).pipe(
      tap(_ => console.log(`edit type=${type}`)),
      catchError(this.handleError<any>(`edit type=${type}`))
    );
  }

  /** GET infraestructure types defined on server */
  public getInfrastructureTypes(): Observable<Category> {
    const url = `${this.rootUrl}/general/infrastructure_types`;
    return this.http
      .get<Category>(url)
      .pipe(
        catchError(
          this.handleError<Category>("getInfrastructureTypes", new Category())
        )
      );
  }

  /** GET damage types defined on server */
  public getDamageTypes(): Observable<Category> {
    const url = `${this.rootUrl}/general/damage_types`;
    return this.http
      .get<Category>(url)
      .pipe(
        catchError(this.handleError<Category>("getDamageTypes", new Category()))
      );
  }

  /** GET tags defined on server */
  public getTags(): Observable<Category> {
    const url = `${this.rootUrl}/general/tags`;
    return this.http
      .get<Category>(url)
      .pipe(catchError(this.handleError<Category>("getTags", new Category())));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
