import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { ProcesosCrearComponent } from "../procesos-crear/procesos-crear.component";
import { ProcesosRelacionarComponent } from "../procesos-relacionar/procesos-relacionar.component";

@Component({
  selector: "procesos",
  templateUrl: "./procesos-home.component.html",
  styleUrls: ["./procesos-home.component.css"]
})
export class ProcesosHomeComponent implements OnInit {
  displayedColumns = ["num", "cod", "proceso", "productos"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  crearProceso() {
    let dialogRef = this.dialog.open(ProcesosCrearComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  relacionarProceso() {
    let dialogRef = this.dialog.open(ProcesosRelacionarComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }
}
