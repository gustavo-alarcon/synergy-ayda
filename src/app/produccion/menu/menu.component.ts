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
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
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
export class MenuComponent implements OnInit {
  toogle: string = null;

  constructor() {
    if (localStorage.getItem("produccion") == null)
      localStorage.setItem("produccion", "1");
    this.toogle = JSON.parse(localStorage.getItem("produccion"));
  }

  ngOnInit() {}

  changePage(page) {
    localStorage.setItem("produccion", page);
    this.toogle = JSON.parse(localStorage.getItem("produccion"));
  }

  getRouteAnimation() {
    return this.toogle;
  }
}
