import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { API_BASE } from '@/config/api';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    number: '',
    message: '',
    isSubmitting: false,
    isSubmitted: false
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState({ ...formState, isSubmitting: true });

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          number: formState.number,
          message: formState.message,
        }),
      });

      if (response.ok) {
        setFormState({
          name: '',
          email: '',
          number: '',
          message: '',
          isSubmitting: false,
          isSubmitted: true,
        });

        setTimeout(() => {
          setFormState((prev) => ({ ...prev, isSubmitted: false }));
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Submission failed");
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting the form");
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Digital Hub</title>
      </Helmet>
      
      <main className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In <span className="highlight">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have questions about our products? We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Email Us</h3>
                  <p className="text-muted-foreground">digital.districtofficial@gmail.com</p>
                  <p className="text-muted-foreground text-sm mt-1">Our team will get back to you within 24 hours.</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Call Us</h3>
                  <p className="text-muted-foreground">+91 9167785948</p>
                  <p className="text-muted-foreground text-sm mt-1">Monday to Sunday, 9am to 5pm EST</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Visit Us</h3>
                  <p className="text-muted-foreground">Suhana Compound</p>
                  <p className="text-muted-foreground">Thane City, TC 400612</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="glass-card p-8 rounded-xl">
                {formState.isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
                    <p className="text-muted-foreground text-lg">Your message has been sent successfully. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                          id="name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Your full name"
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          id="email"
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="number" className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          id="number"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={formState.number}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              setFormState({ ...formState, number: value });
                            }
                          }}
                          placeholder="9876543210"
                          className="h-12"
                        />
                        {formState.number && formState.number.length !== 10 && (
                          <p className="text-sm text-red-500 mt-1">Number must be exactly 10 digits</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                        <textarea
                          id="message"
                          rows={6}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                          placeholder="How can we help you?"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full btn-gradient h-12 text-lg"
                        disabled={formState.isSubmitting}
                      >
                        {formState.isSubmitting ? 'Sending...' : 'Send Message'}
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;