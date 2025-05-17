import { section } from "framer-motion/client";

function Feature() {
    const features = [
        {
            icon: "src/asset/money.svg",
            title: "مدیریت دخل و خرج",
            description: ".با ابزارهای ساده, هزینه‌ها و درآمدهای خود را به راحتی مدیریت کنید",
        },
        {
            icon: "src/asset/chart.svg",
            title: "گزارش‌های مالی",
            description: "گزارش‌های دقیق و نمودارهای بصری برای تحلیل مالی شما.",
        },
        {
            icon: "src/asset/calculate.svg",
            title: "دسته‌بندی تراکنش‌ها",
            description: "هزینه‌هات رو به‌صورت خودکار در دسته‌های مختلف مثل خوراک، حمل‌ونقل و سرگرمی طبقه‌بندی کن."
        },
    ];
    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary"> انتخاب شماست؟ CYP چرا</h2>
                    <p className="text-base md:text-lg text-secondary mt-2 max-w-2xl mx-auto">
                        ابزار مالی ساده و قدرتمند برای مدیریت بهتر پول شما
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg p-6 text-center animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <img
                                src={feature.icon}
                                alt={feature.title}
                                className="w-12 h-12 mx-auto mb-4 text-primary"
                            />
                            <h3 className="text-lg md:text-xl font-semibold text-primary mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-base text-secondary">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default Feature;