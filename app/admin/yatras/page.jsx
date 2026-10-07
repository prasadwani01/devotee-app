// Add at top:
import { supabase } from "@/lib/supabase";

// Inside TripsPage component:
const [yatraList, setYatraList] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadYatras() {
    const { data } = await supabase.from("yatras").select("*").order("id", { ascending: false });
    if (data) setYatraList(data);
    setLoading(false);
  }
  loadYatras();
}, []);