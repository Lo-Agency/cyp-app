function Feature() {
    return (
        <div className="py-16 bg-gray-50 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">ویژگی‌ها</h1>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3  gap-8 px-4 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition w-full mx-auto">
                <img src="src/asset/calculate.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">دسته‌بندی تراکنش‌ها</h2>
                <p className="text-gray-600 text-sm">هزینه‌هات رو به‌صورت خودکار در دسته‌های مختلف مثل خوراک، حمل‌ونقل و سرگرمی طبقه‌بندی کن</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition w-full mx-auto">
            <img src="src/asset/money.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">بودجه‌بندی و مدیریت هزینه</h2>
                <p className="text-gray-600 text-sm">برای هر دسته‌ی مالی سقف تعیین کن و اپ بهت کمک می‌کنه تو چارچوب بودجه خرج کنی</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition w-full mx-auto">
                <img src="src/asset/chart.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">گزارش‌ها و نمودارهای تحلیلی</h2>
                <p className="text-gray-600 text-sm">با گراف‌های ساده و جذاب، روند درآمد و هزینه‌هات رو زیر ذره‌بین ببر</p>
                </div>
        </div>

        </div>
    )
}
export default Feature;