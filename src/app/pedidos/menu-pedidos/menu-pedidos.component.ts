import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query
} from "@angular/animations";

@Component({
  selector: "app-menu-pedidos",
  templateUrl: "./menu-pedidos.component.html",
  styleUrls: ["./menu-pedidos.component.css"],
  animations: [
    trigger("routerAnimation", [
      transition("* <=> *", [
        // Initial state of new route
        query(
          ":enter",
          style({
            position: "fixed",
            width: "100%",
            transform: "translateX(-100%)"
          }),
          { optional: true }
        ),
        // move page off screen right on leave
        query(
          ":leave",
          animate(
            "500ms ease",
            style({
              position: "fixed",
              width: "100%",
              transform: "translateX(100%)"
            })
          ),
          { optional: true }
        ),
        // move page in screen from left to right
        query(
          ":enter",
          animate(
            "500ms ease",
            style({
              opacity: 1,
              transform: "translateX(0%)"
            })
          ),
          { optional: true }
        )
      ])
    ])
  ]
})
export class MenuPedidosComponent implements OnInit {
  toogle: string = null;

  constructor() {
    if (localStorage.getItem("pedidos") == null)
      localStorage.setItem("pedidos", "1");
    this.toogle = JSON.parse(localStorage.getItem("pedidos"));
  }

  ngOnInit() {}

  changePage(page) {
    localStorage.setItem("pedidos", page);
    this.toogle = JSON.parse(localStorage.getItem("pedidos"));
  }

  getRouteAnimation() {
    return this.toogle;
  }
}
