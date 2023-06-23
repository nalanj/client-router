import { Component } from "@with-cardinal/featurette";

export class Link extends Component {
  attach(opts) {
    this.opts = opts;

    this.listen(this.element, "click", (evt) => this.onClick(evt));
  }

  onClick(evt) {
    this.opts.router.push(evt.target.href);
  }
}
