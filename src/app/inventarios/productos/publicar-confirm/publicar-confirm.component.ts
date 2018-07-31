import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { InventariosService } from "../../../servicios/almacenes/inventarios.service";
import { takeWhile } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-publicar-confirm",
  templateUrl: "./publicar-confirm.component.html",
  styleUrls: ["./publicar-confirm.component.scss"]
})
export class PublicarConfirmComponent implements OnInit {
  productosFiltrados: any[] = [];
  private alive: boolean = true;
  data: any[] = [];
  filteredOptions: any = [];
  isLoadingResults: boolean = false;

  constructor(
    public DialogRef: MatDialogRef<PublicarConfirmComponent>,
    private inventariosService: InventariosService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.inventariosService.currentDataProductos
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.data = res;
      });

      console.log(this.data);
  }

  publicarPaq(){
    //this.inventariosService.publicarPaquete();
  }

  cerrarModal() {
    this.DialogRef.close("false");
  }
}
