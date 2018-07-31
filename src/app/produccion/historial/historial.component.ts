import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { HistorialDetalleComponent } from "../historial-detalle/historial-detalle.component";

@Component({
  selector: "historial",
  templateUrl: "./historial.component.html",
  styleUrls: ["./historial.component.css"]
})
export class HistorialComponent implements OnInit {
  displayedColumns = ["num", "fecha", "doc", "estado"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  abrirDetalle() {
    let dialogRef = this.dialog.open(HistorialDetalleComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }
}
