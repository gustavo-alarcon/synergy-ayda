import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { GenerarOrcComponent } from "../generar-orc/generar-orc.component";

@Component({
  selector: "app-historial-detalle",
  templateUrl: "./historial-detalle.component.html",
  styleUrls: ["./historial-detalle.component.css"]
})
export class HistorialDetalleComponent implements OnInit {
  displayedColumns = [
    "num",
    "cod",
    "material",
    "unidad",
    "cant",
    "stock",
    "estado"
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public DialogRef: MatDialogRef<HistorialDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  onNoClick() {
    this.DialogRef.close("close");
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
