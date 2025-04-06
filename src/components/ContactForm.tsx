
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    isSubmitting: false,
    isSubmitted: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formState.name || !formState.email || !formState.message) {
      return;
    }
    
    setFormState({ ...formState, isSubmitting: true });
    
    // Simulate form submission
    setTimeout(() => {
      setFormState({
        name: '',
        email: '',
        message: '',
        isSubmitting: false,
        isSubmitted: true
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, isSubmitted: false }));
      }, 3000);
    }, 1500);
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
                <p className="text-muted-foreground text-sm">support@resellright.com</p>
                <p className="text-muted-foreground text-sm">Our team will get back to you within 24 hours.</p>
              </div>
            </div>
            
            <div className="glass-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                <p className="text-muted-foreground text-sm">Monday to Friday, 9am to 5pm EST</p>
              </div>
            </div>
            
            <div className="glass-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p className="text-muted-foreground text-sm">123 Digital Avenue</p>
                <p className="text-muted-foreground text-sm">Tech City, TC 12345</p>
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
