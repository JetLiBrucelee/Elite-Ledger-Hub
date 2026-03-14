import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, ChevronDown, Search, MapPin, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { COUNTRIES } from "@/lib/countries";
import { lookupUSZip, isUSZip, lookupPostalCode, searchAddress } from "@/lib/zip-lookup";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  zipCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{
    display: string; address: string; city: string; state: string; zipCode: string; country: string;
  }>>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);
  const debouncedAddressQuery = useDebounce(addressQuery, 400);

  const [zipLooking, setZipLooking] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "", country: "", address: "", city: "", stateProvince: "", zipCode: "" },
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) setShowAddressSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debouncedAddressQuery.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    let cancelled = false;
    searchAddress(debouncedAddressQuery).then((results) => {
      if (!cancelled) {
        setAddressSuggestions(results);
        setShowAddressSuggestions(results.length > 0);
      }
    });
    return () => { cancelled = true; };
  }, [debouncedAddressQuery]);

  const handleAddressSelect = useCallback((suggestion: typeof addressSuggestions[0]) => {
    form.setValue("address", suggestion.address);
    setAddressQuery(suggestion.address);
    if (suggestion.city) form.setValue("city", suggestion.city);
    if (suggestion.state) form.setValue("stateProvince", suggestion.state);
    if (suggestion.zipCode) form.setValue("zipCode", suggestion.zipCode);
    if (suggestion.country) {
      const match = COUNTRIES.find(c => c.toLowerCase() === suggestion.country.toLowerCase());
      if (match) form.setValue("country", match);
    }
    setShowAddressSuggestions(false);
  }, [form]);

  const handleZipChange = useCallback(async (zip: string) => {
    form.setValue("zipCode", zip);
    const trimmed = zip.trim();
    if (!trimmed || trimmed.length < 3) return;

    if (isUSZip(trimmed)) {
      const result = lookupUSZip(trimmed);
      if (result) {
        form.setValue("stateProvince", result.state);
        if (!form.getValues("country")) form.setValue("country", "United States");
      }
    } else if (trimmed.length >= 3) {
      setZipLooking(true);
      const country = form.getValues("country");
      const result = await lookupPostalCode(trimmed, country || undefined);
      if (result) {
        if (result.city) form.setValue("city", result.city);
        if (result.state) form.setValue("stateProvince", result.state);
      }
      setZipLooking(false);
    }
  }, [form]);

  const filteredCountries = COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const onSubmit = async (values: RegisterForm) => {
    try {
      setApiError(null);
      await registerMutation.mutateAsync({ data: values });
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      setApiError(apiErr?.data?.error ?? "Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Registration Complete</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your account has been created successfully. For security reasons, all new accounts require administrator approval before accessing the platform.
          </p>
          <div className="pt-4 border-t border-white/10">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/pattern-bg.png`}
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Background"
        />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Elite Ledger Capital</p>
        </div>

        <Card className="p-8">
          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {apiError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">First Name</label>
                <Input {...form.register("firstName")} placeholder="John" autoComplete="given-name" />
                {form.formState.errors.firstName && <p className="text-xs text-destructive mt-1">{form.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Last Name</label>
                <Input {...form.register("lastName")} placeholder="Doe" autoComplete="family-name" />
                {form.formState.errors.lastName && <p className="text-xs text-destructive mt-1">{form.formState.errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address</label>
              <Input type="email" {...form.register("email")} placeholder="name@example.com" autoComplete="email" />
              {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Phone (Optional)</label>
                <Input {...form.register("phone")} placeholder="----" autoComplete="tel" />
              </div>
              <div ref={countryRef} className="relative">
                <label className="block text-sm font-medium text-white/80 mb-1.5">Country (Optional)</label>
                <button
                  type="button"
                  onClick={() => setCountryOpen(!countryOpen)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span className={form.watch("country") ? "text-white" : "text-white/40"}>
                    {form.watch("country") || "Select country"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/40" />
                </button>
                {countryOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border border-white/10 bg-[#1a1a2e] shadow-xl max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 pl-8 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {filteredCountries.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-white/40">No countries found</div>
                      ) : (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => {
                              form.setValue("country", country);
                              setCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                              form.watch("country") === country ? "bg-primary/20 text-primary" : "text-white/80"
                            }`}
                          >
                            {country}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div ref={addressRef} className="relative">
              <label className="block text-sm font-medium text-white/80 mb-1.5">Address (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    form.setValue("address", e.target.value);
                    if (e.target.value.length >= 3) setShowAddressSuggestions(true);
                  }}
                  placeholder="Start typing your address..."
                  autoComplete="off"
                  className="pl-9"
                />
              </div>
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-white/10 bg-[#1a1a2e] shadow-xl max-h-48 overflow-y-auto">
                  {addressSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddressSelect(s)}
                      className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                    >
                      <span className="line-clamp-2">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">City (Optional)</label>
                <Input {...form.register("city")} placeholder="City" autoComplete="address-level2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">State / Province (Optional)</label>
                <Input {...form.register("stateProvince")} placeholder="State / Province" autoComplete="address-level1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">ZIP / Postal Code (Optional)</label>
                <div className="relative">
                  <Input
                    {...form.register("zipCode")}
                    onChange={(e) => handleZipChange(e.target.value)}
                    placeholder="ZIP / Postal code"
                    autoComplete="postal-code"
                  />
                  {zipLooking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" variant="premium" className="w-full mt-6" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
