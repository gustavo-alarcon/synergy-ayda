import { InventariosService } from "./../../../servicios/almacenes/inventarios.service";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-crear-paquete",
  templateUrl: "./crear-paquete.component.html",
  styleUrls: ["./crear-paquete.component.css"]
})
export class CrearPaqueteComponent implements OnInit {
  crearPaqueteForm: FormGroup;

  productos: any[] = [];
  almacenes: any[] = [];
  productos_filtrado: any[] = [];
  almacenName: string = "";
  pack: string = "";
  items: any[] = [
    { Pack: "", ID_producto: "", Cantidad: 0, PrecioUnitario: 0, Inversion: 0, Venta_pack:0, Utilidad:0, Publicar:0 }
  ];

  totalInvertido: any = 0.0;
  precioVenta: any = 0.0;
  utilidad: any = 0.0;

  constructor(
    private inventariosService: InventariosService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.inventariosService.currentDataProductos.subscribe(res => {
      this.productos = res;
    });

    this.inventariosService.currentDataAlmacenes.subscribe(res => {
      this.almacenes = res;
    });
  }

  guardarPaquete() {
    this.items.forEach(element => {
      element["Pack"] = this.pack;
      element["Almacen"] = this.almacenName;
      element["Inversion"] = this.totalInvertido;
      element["Venta_pack"] = this.precioVenta;
      element["Utilidad"] = this.utilidad;
    });

    if (this.items.length > 0 && this.items[0].ID_producto != "") {
      this.inventariosService.crearPaquete(this.items);
    } else {
      this.snackBar.open("Agregue productos al paquete", "Cerrar", {
        duration: 10000
      });
    }

    this.cd.markForCheck();
  }

  agregarItem() {
    this.items.push({
      Pack: "",
      ID_producto: "",
      Cantidad: 0,
      PrecioUnitario: 0,
      Inversion: 0,
      Venta_pack: 0,
      Utilidad: 0,
      Publicar: 0
    });
  }

  filtrarProductos(alm: string) {
    this.productos_filtrado = [];

    this.productos.forEach(element => {
      if (element["Zona"] === alm) {
        this.productos_filtrado.push(element);
      }
    });

    this.almacenName = alm;
  }

  setProduct(prod: any, idx: any) {
    this.items[idx]["ID_producto"] = prod.ID;
  }

  calcInver(calcUnit: any, idx: any){

    this.items[idx]["PrecioUnitario"] = calcUnit;

    this.totalInvertido = 0.0;

    this.items.forEach(element => {
      this.totalInvertido = parseFloat(this.totalInvertido) + parseFloat(element.PrecioUnitario);
    });
  }

  setUtilidad(pv: any){
    this.utilidad = parseFloat(pv) - parseFloat(this.totalInvertido);
  }

  setPrecioVenta(util: any){
    this.precioVenta = parseFloat(util) + parseFloat(this.totalInvertido);
  }
}
