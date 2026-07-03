import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FC } from "react";
// import { showAlert } from '../component/Alert';

// Define the form data shape
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const Contact: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (res.ok) {
        // showAlert('success', 'Message sent successfully');
        reset();
      } else {
        const err = await res.json().catch(() => ({}));
        // showAlert('error', err.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error("Message sending failed:", error);
      //   showAlert('error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-full  text-slate-900  pt-12 pb-12 sm:pb-24 px-4 sm:px-6 md:px-12  overflow-hidden transition-colors duration-300 bg-white ">
      {/* Grid Background — light mode lines */}
      <div
        className="absolute inset-0 opacity-30  transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,70,229,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,70,229,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
      {/* Grid Background — dark mode lines */}
      <div
        className="absolute inset-0 opacity-0  transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
      <div className=" px-0 sm:px-20 pt-0 sm:pt-8 w-full">
        <span className="font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-blue-600 ">
          Get in touch
        </span>
        <h1 className="mt-1 sm:mt-2 text-[21px] sm:text-4xl font-semibold tracking-tight text-slate-900 ">
          Let's start the conversation.
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-slate-600  ">
          Tell us a bit about your project and we'll get back to you with next
          steps, not a sales pitch.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" sm:mx-20 mt-4 sm:mt-8  flex flex-col gap-5  pt-8 "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[11px] sm:text-[12px] font-semibold text-indigo-400  uppercase tracking-wider"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className={`px-4 py-2 bg-slate-50/50  border rounded text-[11px] sm:text-[12px] text-slate-900  placeholder-slate-400 focus:outline-none  transition-all ${
                errors.name ? "border-red-500 " : "border-slate-200 "
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-[10px] text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[11px] sm:text-[12px] font-semibold text-indigo-400  uppercase tracking-wider"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`px-4 py-2 bg-slate-50/50  border rounded text-[11px] sm:text-[12px] text-slate-900  placeholder-slate-400 focus:outline-none  transition-all ${
                errors.email ? "border-red-500 " : "border-slate-200"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-[10px] text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-[11px] sm:text-[12px] font-semibold text-indigo-400/90  uppercase tracking-wider"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className={`px-4 py-2 bg-slate-50/50  border rounded text-[11px] sm:text-[12px] text-slate-900  placeholder-slate-400 focus:outline-none  transition-all ${
                errors.email ? "border-red-500 " : "border-slate-200 "
              }`}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phone && (
              <span className="text-[10px] text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="subject"
              className="text-[11px] sm:text-[12px] font-semibold text-indigo-400  uppercase tracking-wider"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Subject"
              className={`px-4 py-2 bg-slate-50/50  border rounded text-[11px] sm:text-[12px] text-slate-900  placeholder-slate-400 focus:outline-none  transition-all ${
                errors.email ? "border-red-500 " : "border-slate-200 "
              }`}
              {...register("subject", {
                required: "Subject is required",
              })}
            />
            {errors.subject && (
              <span className="text-[10px] text-red-500">
                {errors.subject.message}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-[11px] sm:text-[12px] font-semibold text-indigo-400  uppercase tracking-wider"
          >
            Project details
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Tell us about your project goals, timelines, and requirements..."
            className={`px-4 py-2 bg-slate-50/50  border rounded text-[11px] sm:text-[12px] text-slate-900  placeholder-slate-400 focus:outline-none  transition-all resize-none ${
              errors.message ? "border-red-500 " : "border-slate-200 "
            }`}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <span className="text-[10px] text-red-500">
              {errors.message.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full  px-8 py-3 text-indigo-400  bg-gradient-to-t from-indigo-100 via-white to-indigo-100   hover:brightness-[0.97] text-center hover:bg-slate-100 rounded  font-semibold tracking-wide transition-all  active:scale-98 cursor-pointer relative z-10"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </main>
  );
};

export default Contact;
