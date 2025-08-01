
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { API_BASE } from '@/config/api';

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    number: '',
    message: '',
    isSubmitting: false,
    isSubmitted: false
  });
  
  const handleSubmit = async (e) => {
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
    <section className="section-padding bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In <span className="highlight">Touch</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-muted-foreground text-sm">digital.districtofficial@gmail.com</p>
                <p className="text-muted-foreground text-sm">Our team will get back to you within 24 hours.</p>
              </div>
            </div>
            
            <div className="glass-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-muted-foreground text-sm">+91 9167785948</p>
                <p className="text-muted-foreground text-sm">Monday to Sunday, 9am to 5pm EST</p>
              </div>
            </div>
            
            <div className="glass-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p className="text-muted-foreground text-sm">Suhana Compound</p>
                <p className="text-muted-foreground text-sm">Thane City, TC 400612</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="glass-card p-6 rounded-xl">
              {formState.isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        id="contact-name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                     <div>
                      <label htmlFor="contact-number" className="block text-sm font-medium mb-1">Number</label>
                      <Input
                        id="contact-number"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={formState.number}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                          if (value.length <= 10) {
                            setFormState({ ...formState, number: value });
                          }
                        }}
                        placeholder="9876543210"
                        required
                      />
                      {formState.number && formState.number.length !== 10 && (
                        <p className="text-sm text-red-500 mt-1">Number must be exactly 10 digits</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full btn-gradient"
                      disabled={formState.isSubmitting}
                    >
                      {formState.isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
