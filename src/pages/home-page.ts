import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";

@customElement("home-page")
export class HomePage extends LitElement {
  static styles = css`
    :host { display: block; }
  `;

  render() {
    return html`
      <sl-card>
        <strong slot="header">Home</strong>
        <p>Welcome to the customer frontend.</p>
      </sl-card>
    `;
  }
}
