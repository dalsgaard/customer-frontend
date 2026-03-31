import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { SignalWatcher, signal } from "@lit-labs/signals";
import { api } from "../api/client.js";
import type { components } from "../../openapi/types.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";

type Customer = components["schemas"]["Customer"];

const customers = signal<Customer[]>([]);
const loading = signal(false);
const error = signal<string | null>(null);

async function loadCustomers() {
  loading.set(true);
  error.set(null);
  const { data, error: err } = await api.GET("/customers");
  if (err) {
    error.set("Failed to load customers.");
  } else {
    customers.set(data.customers);
  }
  loading.set(false);
}

async function deleteCustomer(id: string) {
  const { error: err } = await api.DELETE("/customers/{id}", {
    params: { path: { id } },
  });
  if (err) {
    error.set("Failed to delete customer.");
  } else {
    customers.set(customers.get().filter((c) => c.id !== id));
  }
}

@customElement("customers-page")
export class CustomersPage extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .customer-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .customer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      border: 1px solid var(--sl-color-neutral-200);
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .customer-name {
      font-weight: var(--sl-font-weight-semibold);
    }

    .customer-email {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-500);
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    sl-spinner {
      font-size: 2rem;
      display: block;
      margin: 2rem auto;
      text-align: center;
    }

    .empty {
      text-align: center;
      color: var(--sl-color-neutral-400);
      padding: 2rem;
    }
  `;

  @state() private dialogOpen = false;
  @state() private name = "";
  @state() private email = "";
  @state() private saving = false;

  connectedCallback() {
    super.connectedCallback();
    loadCustomers();
  }

  private async handleCreate() {
    this.saving = true;
    const { data, error: err } = await api.POST("/customers", {
      body: { name: this.name, email: this.email },
    });
    if (err) {
      error.set("Failed to create customer.");
    } else {
      customers.set([...customers.get(), data]);
      this.dialogOpen = false;
      this.name = "";
      this.email = "";
    }
    this.saving = false;
  }

  private openDialog() {
    this.name = "";
    this.email = "";
    this.dialogOpen = true;
  }

  render() {
    return html`
      ${error.get()
        ? html`<sl-alert variant="danger" open closable @sl-after-hide=${() => error.set(null)}>
            ${error.get()}
          </sl-alert>`
        : ""}

      <sl-card>
        <div class="header" slot="header">
          <strong>Customers</strong>
          <sl-button variant="primary" size="small" @click=${this.openDialog}>
            Add Customer
          </sl-button>
        </div>

        ${loading.get()
          ? html`<sl-spinner></sl-spinner>`
          : customers.get().length === 0
            ? html`<p class="empty">No customers yet.</p>`
            : html`
                <div class="customer-list">
                  ${customers.get().map(
                    (c) => html`
                      <div class="customer-row">
                        <div class="customer-info">
                          <span class="customer-name">${c.name}</span>
                          <span class="customer-email">${c.email}</span>
                        </div>
                        <sl-icon-button
                          name="trash"
                          label="Delete"
                          @click=${() => deleteCustomer(c.id)}
                        ></sl-icon-button>
                      </div>
                    `
                  )}
                </div>
              `}
      </sl-card>

      <sl-dialog
        label="Add Customer"
        ?open=${this.dialogOpen}
        @sl-after-hide=${() => (this.dialogOpen = false)}
      >
        <div class="form-fields">
          <sl-input
            label="Name"
            value=${this.name}
            @sl-input=${(e: Event) => (this.name = (e.target as HTMLInputElement).value)}
          ></sl-input>
          <sl-input
            label="Email"
            type="email"
            value=${this.email}
            @sl-input=${(e: Event) => (this.email = (e.target as HTMLInputElement).value)}
          ></sl-input>
        </div>
        <sl-button
          slot="footer"
          variant="primary"
          ?loading=${this.saving}
          ?disabled=${!this.name || !this.email || this.saving}
          @click=${this.handleCreate}
        >
          Save
        </sl-button>
        <sl-button slot="footer" @click=${() => (this.dialogOpen = false)}>
          Cancel
        </sl-button>
      </sl-dialog>
    `;
  }
}
