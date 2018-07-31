import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";

@Component({
  selector: "app-procesos-relacionar",
  templateUrl: "./procesos-relacionar.component.html",
  styleUrls: ["./procesos-relacionar.component.css"]
})
export class ProcesosRelacionarComponent implements OnInit {
  displayedColumns = ["num", "codigo", "nombre", "borrar"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public DialogRef: MatDialogRef<ProcesosRelacionarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.DialogRef.close("true");
  }

  onNoClick() {
    this.DialogRef.close("false");
  }
}
