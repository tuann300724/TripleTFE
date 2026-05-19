import OverviewView from "./views/OverviewView";
import ProductsView from "./views/ProductsView";
import CustomersView from "./views/CustomersView";
import OrdersView from "./views/OrdersView";
import InvoicesView from "./views/InvoicesView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import ProfileView from "./views/ProfileView";
import { useAdmin } from "./context/AdminContext";

const PAGES = {
  overview: OverviewView,
  products: ProductsView,
  customers: CustomersView,
  orders: OrdersView,
  invoices: InvoicesView,
  analytics: AnalyticsView,
  profile: ProfileView,
  settings: SettingsView,
};

export default function Dashboard() {
  const { page } = useAdmin();
  const View = PAGES[page] || OverviewView;
  return <View />;
}
