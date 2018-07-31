import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ConfirmarOrcComponent } from "../confirmar-orc/confirmar-orc.component";

@Component({
  selector: "app-generar-orc",
  templateUrl: "./generar-orc.component.html",
  styleUrls: ["./generar-orc.component.css"]
})
export class GenerarOrcComponent implements OnInit {
  displayedColumns = [
    "num",
    "cod",
    "material",
    "unidad",
    "cant",
    "stock",
    "req"
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public DialogRef: MatDialogRef<GenerarOrcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  confirmarORC() {
    let dialogRef = this.dialog.open(ConfirmarOrcComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  onNoClick() {
    this.DialogRef.close("close");
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
