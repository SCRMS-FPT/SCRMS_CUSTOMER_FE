import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Support = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [faqOpen, setFaqOpen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const faqs = [
    { question: "How do I reset my password?", answer: "You can reset your password by clicking on 'Forgot Password' at the login screen and following the instructions." },
    { question: "How can I contact customer service?", answer: "You can contact our support team via email at support@courtsite.com or call us at (123) 456-7890." },
    { question: "How do I change my account details?", answer: "Go to your account settings, where you can update your email, phone number, and other details." },
    { question: "Do you offer refunds?", answer: "Refunds are available under specific conditions. Please check our refund policy for more details." },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      // Simulated API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmissionMessage("Your message has been sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmissionMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-blue-600">Support Center</h1>
      <p className="text-gray-600 mt-2 text-center">We’re here to help! Contact us or find answers to your questions.</p>

      {/* Contact Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <div className="mt-4">
          <p className="flex items-center gap-2"><FaPhoneAlt className="text-blue-600" /> (123) 456-7890</p>
          <p className="flex items-center gap-2 mt-2"><FaEnvelope className="text-blue-600" /> support@courtsite.com</p>
          <p className="flex items-center gap-2 mt-2"><FaMapMarkerAlt className="text-blue-600" /> 123 Sports Street, NY, USA</p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="mt-4 border-b pb-2">
            <button className="w-full text-left text-blue-600 font-medium focus:outline-none" onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
              {faq.question}
            </button>
            {faqOpen === index && <p className="mt-2 text-gray-700">{faq.answer}</p>}
          </div>
        ))}
      </div>

      {/* Support Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />

          <label className="block text-gray-700 mt-4">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />

          <label className="block text-gray-700 mt-4">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="4"
            required
          ></textarea>

          {submissionMessage && <p className="mt-4 text-green-600">{submissionMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Live Chat Placeholder */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Live Chat</h2>
        <p className="text-gray-600 mt-2">Our live chat feature will be available soon!</p>
      </div>

      {/* Help Articles */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Help Articles</h2>
        <ul className="mt-4 list-disc pl-6 text-blue-600">
          <li><a href="#" className="hover:underline">How to book a court?</a></li>
          <li><a href="#" className="hover:underline">Troubleshooting login issues</a></li>
          <li><a href="#" className="hover:underline">Understanding membership benefits</a></li>
        </ul>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-4 mt-6">
        <a href="#" className="text-blue-600 text-2xl"><FaFacebook /></a>
        <a href="#" className="text-blue-400 text-2xl"><FaTwitter /></a>
        <a href="#" className="text-pink-500 text-2xl"><FaInstagram /></a>
        <a href="#" className="text-blue-700 text-2xl"><FaLinkedin /></a>
      </div>
    </div>
  );
};

export default Support;
