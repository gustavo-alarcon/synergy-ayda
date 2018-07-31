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
  selector: "app-ver-orp",
  templateUrl: "./ver-orp.component.html",
  styleUrls: ["./ver-orp.component.css"]
})
export class VerOrpComponent implements OnInit {
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
    public DialogRef: MatDialogRef<VerOrpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  generarORC() {
    let dialogRef = this.dialog.open(GenerarOrcComponent, {
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
