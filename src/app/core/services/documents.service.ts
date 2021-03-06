import { Injectable } from "@angular/core";

import { Observable, of, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { ContentSection } from "@app/shared/models/content-section";

import { CaseDocumentCreateRequest } from "@app/shared/models/case-document-create-request";
import { CaseDocumentMetadata } from "@app/shared/models/case-document-metadata";
import { CaseDocumentResponse } from "@app/shared/models/case-document-response";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DocumentsService {
  constructor(private http: HttpClient) {}

  private rootUrl = environment.rootUrl; // URL to web api

  private httpOptions = {
    headers: new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json; charset-utf-8",
    }),
  };

  //Route Client Functions:

  /** GET document metadata. Will 404 if there are no documents */
  public getDocuments(): Observable<CaseDocumentMetadata[]> {
    const url = `${this.rootUrl}/documents/`;
    return this.http.get<CaseDocumentMetadata[]>(url, this.httpOptions);
    //.pipe(catchError(this.handleError<CaseDocumentMetadata[]>("getDocuments")));
  }

  /** POST new document on the server */
  public createDocument(req: CaseDocumentCreateRequest): Observable<any> {
    const url = `${this.rootUrl}/documents/create`;
    return this.http.post(url, req, this.httpOptions);
    //.pipe(catchError(this.handleError<any>("createDocument")));
  }

  /** DELETE document on the server */
  public removeDocument(docid: string): Observable<any> {
    const url = `${this.rootUrl}/documents/remove/${docid}`;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>(`remove document docid=${docid}`))
      );
  }

  /** GET document by id. Will 404 if id not found */
  public getDocumentById(docid: string): Observable<CaseDocumentResponse> {
    const url = `${this.rootUrl}/documents/${docid}`;
    return this.http
      .get<CaseDocumentResponse>(url)
      .pipe(
        catchError(
          this.handleError<CaseDocumentResponse>(
            `getDocumentById docid=${docid}`
          )
        )
      );
  }

  /** POST new section */
  public createSection(docid: string): Observable<any> {
    const url = `${this.rootUrl}/documents/${docid}/edit/section/create`;
    return this.http
      .post(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError<any>("createSection")));
  }

  /** POST remove a section */
  public removeSection(docid: string, secid: number): Observable<any> {
    const url = `${this.rootUrl}/documents/${docid}/edit/section/remove/${secid}`;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(catchError(this.handleError<any>("deleteSection")));
  }

  /** PUT: update the document section on the server */
  public editDocumentSection(
    docid: string,
    sec: ContentSection,
    pos: number
  ): Observable<any> {
    const url = `${this.rootUrl}/documents/${docid}/edit/section/${pos}`;
    let body = { section_title: sec.secTitle, section_text: sec.content };
    return this.http.put(url, body, this.httpOptions);
  }

  /** PUT: edit document metadata on the server
   * @argument type document field to edit on the server.
   */
  public edit(docid: string, type: string, body: any): Observable<any> {
    const url = `${this.rootUrl}/documents/${docid}/edit/${type}`;
    return this.http.put(url, body, this.httpOptions);
  }

  /** GET infraestructure types defined on server */
  public getInfrastructureTypes(): Observable<string[]> {
    const url = `${this.rootUrl}/general/infrastructure_types`;
    return this.http.get<string[]>(url).pipe(
      catchError(
        this.handleError<string[]>("getInfrastructureTypes", [""])
      )
    );
  }

  /** GET damage types defined on server */
  public getDamageTypes(): Observable<string[]> {
    const url = `${this.rootUrl}/general/damage_types`;
    return this.http.get<string[]>(url, this.httpOptions).pipe(
      catchError(
        this.handleError<string[]>("getDamageTypes", [""])
      )
    );
  }

  /** GET tags defined on server */
  public getTags(): Observable<string[]> {
    const url = `${this.rootUrl}/general/tags`;
    return this.http.get<string[]>(url, this.httpOptions).pipe(
      catchError(
        this.handleError<string[]>("getTags", [""])
      )
    );
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
