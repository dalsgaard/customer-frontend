import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";

@customElement("not-found-page")
export class NotFoundPage extends LitElement {
  static styles = css`
    :host { display: block; }
  `;

  render() {
    return html`
      <sl-card>
        <strong slot="header">404</strong>
        <p>Page not found.</p>
      </sl-card>
    `;
  }
}
