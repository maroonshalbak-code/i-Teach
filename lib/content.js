'use client';

export const CATEGORIES = [
  { id: 'nature',         title: 'Nature',         emoji: '🌿', color: '#22c55e' },
  { id: 'technology',     title: 'Technology',     emoji: '💻', color: '#6366f1' },
  { id: 'emotions',       title: 'Emotions',       emoji: '😊', color: '#f59e0b' },
  { id: 'science',        title: 'Science',        emoji: '🔬', color: '#0ea5e9' },
  { id: 'transportation', title: 'Transportation', emoji: '🚗', color: '#ef4444' },
  { id: 'food',           title: 'Food',           emoji: '🍎', color: '#f97316' },
];

export const TOTAL_PHASES = 100;

export const WORD_BANK = {
  nature: [
  { word: 'Sun', arabicWord: 'شمس', arabicDefinition: 'النجم الذي يضيء نهارنا ويعطينا الدفء', example: 'The sun is bright today.' },
  { word: 'Tree', arabicWord: 'شجرة', arabicDefinition: 'نبتة كبيرة لها جذع وأغصان وأوراق', example: 'The tree is very tall.' },
  { word: 'Rain', arabicWord: 'مطر', arabicDefinition: 'قطرات الماء التي تسقط من السماء', example: 'The rain is falling.' },
  { word: 'Flower', arabicWord: 'زهرة', arabicDefinition: 'الجزء الملوّن والجميل من النبتة', example: 'This flower smells nice.' },
  { word: 'Bird', arabicWord: 'طائر', arabicDefinition: 'حيوان له أجنحة ويطير في السماء', example: 'The bird sings every morning.' },
  { word: 'Water', arabicWord: 'ماء', arabicDefinition: 'سائل شفاف نشربه ونستخدمه في حياتنا', example: 'I drink water every day.' },
  { word: 'Cloud', arabicWord: 'سحابة', arabicDefinition: 'كتلة بيضاء أو رمادية في السماء مكوّنة من بخار الماء', example: 'The cloud is big and white.' },
  { word: 'Mountain', arabicWord: 'جبل', arabicDefinition: 'أرض مرتفعة جداً شاهقة في السماء', example: 'We climbed the mountain.' },
  { word: 'River', arabicWord: 'نهر', arabicDefinition: 'تيار طبيعي من الماء يجري نحو البحر', example: 'Fish live in the river.' },
  { word: 'Forest', arabicWord: 'غابة', arabicDefinition: 'منطقة كبيرة مليئة بالأشجار والنباتات', example: 'The forest is full of animals.' },
  { word: 'Grass', arabicWord: 'عشب', arabicDefinition: 'نبات أخضر صغير يغطي الأرض', example: 'The grass is soft and green.' },
  { word: 'Wind', arabicWord: 'ريح', arabicDefinition: 'هواء يتحرك بسرعة ويمكن الإحساس به', example: 'The wind is blowing the leaves.' },
  { word: 'Desert', arabicWord: 'صحراء', arabicDefinition: 'منطقة جافة جداً بها رمال وقليل من المطر', example: 'The desert is very hot and dry.' },
  { word: 'Island', arabicWord: 'جزيرة', arabicDefinition: 'قطعة أرض محاطة بالماء من كل الجهات', example: 'The island is surrounded by the sea.' },
  { word: 'Cave', arabicWord: 'كهف', arabicDefinition: 'حفرة طبيعية في جبل أو تحت الأرض', example: 'Bats live in the cave.' },
  { word: 'Waterfall', arabicWord: 'شلال', arabicDefinition: 'تدفق الماء من مكان مرتفع إلى مكان منخفض', example: 'The waterfall makes a loud sound.' },
  { word: 'Volcano', arabicWord: 'بركان', arabicDefinition: 'جبل يمكنه إطلاق الحمم والغازات الساخنة', example: 'The volcano erupted last year.' },
  { word: 'Jungle', arabicWord: 'غابة استوائية', arabicDefinition: 'غابة استوائية كثيفة وحارة ورطبة جداً', example: 'The jungle is full of wild animals.' },
  { word: 'Glacier', arabicWord: 'نهر جليدي', arabicDefinition: 'كتلة ضخمة من الجليد تتحرك ببطء على الأرض', example: 'The glacier is slowly melting.' },
  { word: 'Canyon', arabicWord: 'واد عميق', arabicDefinition: 'وادٍ عميق بين جبال متقاربة حفره النهر', example: 'The canyon is very deep and wide.' },
  { word: 'Plateau', arabicWord: 'هضبة', arabicDefinition: 'منطقة مستوية مرتفعة فوق سطح البحر', example: 'The plateau is flat but very high.' },
  { word: 'Lagoon', arabicWord: 'بحيرة ساحلية', arabicDefinition: 'مسطح مائي ضحل محاط بشعاب مرجانية أو رمال', example: 'The lagoon has clear blue water.' },
  { word: 'Tundra', arabicWord: 'منطقة قطبية', arabicDefinition: 'منطقة باردة جداً بدون أشجار قرب القطبين', example: 'Few animals live in the tundra.' },
  { word: 'Peninsula', arabicWord: 'شبه جزيرة', arabicDefinition: 'قطعة أرض تبرز في البحر وتتصل باليابسة من جهة واحدة', example: 'The city is on a peninsula.' },
  { word: 'Ecosystem', arabicWord: 'نظام بيئي', arabicDefinition: 'مجموعة من الكائنات الحية وبيئتها التي تتفاعل معاً', example: 'A healthy ecosystem has many species.' },
  { word: 'Erosion', arabicWord: 'تآكل', arabicDefinition: 'عملية تدريجية لتآكل الصخور والتربة بفعل الماء والريح', example: 'Erosion changes the shape of the land.' },
  { word: 'Drought', arabicWord: 'جفاف', arabicDefinition: 'فترة طويلة جداً من الجفاف وقلة الأمطار', example: 'The drought destroyed the crops.' },
  { word: 'Hibernate', arabicWord: 'يشتّت / يسبت', arabicDefinition: 'حالة نوم عميق تدخل فيها بعض الحيوانات في الشتاء', example: 'Bears hibernate during winter.' },
  { word: 'Camouflage', arabicWord: 'تمويه', arabicDefinition: 'قدرة الكائن الحي على إخفاء نفسه بمزج ألوانه مع البيئة', example: 'The chameleon uses camouflage to hide.' },
  { word: 'Biodiversity', arabicWord: 'تنوع بيولوجي', arabicDefinition: 'تنوع جميع الكائنات الحية في منطقة معينة', example: 'The rainforest has great biodiversity.' },
  ],
  technology: [
  { word: 'Phone', arabicWord: 'هاتف', arabicDefinition: 'جهاز نستخدمه للتحدث مع الآخرين وإرسال الرسائل', example: 'I call my mom on the phone.' },
  { word: 'Screen', arabicWord: 'شاشة', arabicDefinition: 'السطح الزجاجي الذي يعرض الصور والنصوص', example: 'The screen is very bright.' },
  { word: 'Computer', arabicWord: 'حاسوب', arabicDefinition: 'آلة إلكترونية تعالج المعلومات وتنفذ المهام', example: 'I use the computer for homework.' },
  { word: 'Camera', arabicWord: 'كاميرا', arabicDefinition: 'جهاز يلتقط الصور والفيديو', example: 'She took a photo with her camera.' },
  { word: 'Button', arabicWord: 'زر', arabicDefinition: 'شيء صغير نضغط عليه لتشغيل جهاز', example: 'Press the button to turn it on.' },
  { word: 'Battery', arabicWord: 'بطارية', arabicDefinition: 'مصدر الطاقة الذي يشغّل الأجهزة الإلكترونية', example: 'My battery is almost empty.' },
  { word: 'Internet', arabicWord: 'إنترنت', arabicDefinition: 'شبكة عالمية تربط الحواسيب وتتيح تبادل المعلومات', example: 'I use the internet to learn new things.' },
  { word: 'Keyboard', arabicWord: 'لوحة مفاتيح', arabicDefinition: 'لوحة بها مفاتيح لكتابة الحروف والأرقام على الحاسوب', example: 'She types fast on the keyboard.' },
  { word: 'Mouse', arabicWord: 'ماوس', arabicDefinition: 'أداة صغيرة تتحكم في مؤشر الشاشة', example: 'Move the mouse to select the file.' },
  { word: 'Printer', arabicWord: 'طابعة', arabicDefinition: 'جهاز يطبع النصوص والصور على الورق', example: 'The printer is out of paper.' },
  { word: 'Tablet', arabicWord: 'لوح إلكتروني', arabicDefinition: 'جهاز مسطح بشاشة لمسية للقراءة والتصفح', example: 'He reads books on his tablet.' },
  { word: 'Headphones', arabicWord: 'سماعات', arabicDefinition: 'جهاز يُوضع على الأذنين لسماع الصوت بشكل خاص', example: 'She listens to music with headphones.' },
  { word: 'Software', arabicWord: 'برنامج', arabicDefinition: 'مجموعة التعليمات التي تجعل الحاسوب يؤدي مهام معينة', example: 'We need to update the software.' },
  { word: 'Download', arabicWord: 'تحميل', arabicDefinition: 'نقل الملفات أو البرامج من الإنترنت إلى جهازك', example: 'I will download the app now.' },
  { word: 'Password', arabicWord: 'كلمة مرور', arabicDefinition: 'مجموعة حروف وأرقام سرية للدخول إلى حساب أو جهاز', example: 'Never share your password with others.' },
  { word: 'Bluetooth', arabicWord: 'بلوتوث', arabicDefinition: 'تقنية لاسلكية لتوصيل الأجهزة ببعضها على مسافة قريبة', example: 'Connect the speaker using Bluetooth.' },
  { word: 'Microphone', arabicWord: 'ميكروفون', arabicDefinition: 'جهاز يلتقط الصوت ويحوّله إلى إشارات إلكترونية', example: 'Speak into the microphone clearly.' },
  { word: 'Charger', arabicWord: 'شاحن', arabicDefinition: 'جهاز لإعادة شحن بطارية الهاتف أو الحاسوب', example: 'Don\'t forget your charger.' },
  { word: 'Algorithm', arabicWord: 'خوارزمية', arabicDefinition: 'مجموعة خطوات منظمة يتبعها الحاسوب لحل مشكلة', example: 'The search algorithm finds results quickly.' },
  { word: 'Database', arabicWord: 'قاعدة بيانات', arabicDefinition: 'مخزن منظم للمعلومات يمكن البحث فيها بسهولة', example: 'The database stores all student records.' },
  { word: 'Processor', arabicWord: 'معالج', arabicDefinition: 'الجزء المركزي في الحاسوب الذي ينفذ الحسابات', example: 'A fast processor makes the computer faster.' },
  { word: 'Encryption', arabicWord: 'تشفير', arabicDefinition: 'تحويل المعلومات إلى رمز سري لحمايتها من الآخرين', example: 'Encryption keeps your messages safe.' },
  { word: 'Bandwidth', arabicWord: 'عرض النطاق الترددي', arabicDefinition: 'كمية البيانات التي يمكن نقلها عبر الشبكة في وقت معين', example: 'More bandwidth means faster internet.' },
  { word: 'Application', arabicWord: 'تطبيق', arabicDefinition: 'برنامج مصمم لأداء مهمة معينة على الجهاز', example: 'Download this application for free.' },
  { word: 'Cybersecurity', arabicWord: 'أمن إلكتروني', arabicDefinition: 'ممارسات وتقنيات لحماية الأنظمة والشبكات من الهجمات', example: 'Cybersecurity protects our online data.' },
  { word: 'Artificial Intelligence', arabicWord: 'ذكاء اصطناعي', arabicDefinition: 'قدرة الآلات على محاكاة التفكير الإنساني وحل المشكلات', example: 'Artificial intelligence can translate languages.' },
  { word: 'Blockchain', arabicWord: 'سلسلة الكتل', arabicDefinition: 'سجل رقمي موزع يخزن المعاملات بطريقة آمنة وشفافة', example: 'Blockchain is used in digital currencies.' },
  { word: 'Cloud Computing', arabicWord: 'حوسبة سحابية', arabicDefinition: 'تخزين البيانات وتشغيل البرامج عبر الإنترنت بدلاً من الجهاز المحلي', example: 'Cloud computing lets you work from anywhere.' },
  { word: 'Machine Learning', arabicWord: 'تعلم الآلة', arabicDefinition: 'نوع من الذكاء الاصطناعي يتعلم فيه الحاسوب من البيانات تلقائياً', example: 'Machine learning helps apps get smarter.' },
  { word: 'Middleware', arabicWord: 'برمجيات وسيطة', arabicDefinition: 'برمجيات تربط بين أنظمة مختلفة وتتيح تواصلها', example: 'Middleware connects the app to the database.' },
  ],
  emotions: [
  { word: 'Happy', arabicWord: 'سعيد', arabicDefinition: 'شعور بالفرح والرضا والبهجة', example: 'I feel happy when I play with friends.' },
  { word: 'Sad', arabicWord: 'حزين', arabicDefinition: 'شعور بالحزن والكآبة والضيق', example: 'She felt sad when she lost her toy.' },
  { word: 'Angry', arabicWord: 'غاضب', arabicDefinition: 'شعور قوي بعدم الرضا أو الانزعاج الشديد', example: 'He got angry when someone pushed him.' },
  { word: 'Scared', arabicWord: 'خائف', arabicDefinition: 'شعور بالخوف عند مواجهة شيء مرعب أو خطير', example: 'She was scared of the dark room.' },
  { word: 'Tired', arabicWord: 'متعب', arabicDefinition: 'شعور بالإرهاق وعدم القدرة على الاستمرار', example: 'I am tired after running a lot.' },
  { word: 'Surprised', arabicWord: 'مندهش', arabicDefinition: 'شعور يأتي عند حدوث شيء غير متوقع فجأة', example: 'She was surprised by the gift.' },
  { word: 'Excited', arabicWord: 'متحمس', arabicDefinition: 'شعور بالفرح الشديد والتوقع لشيء جميل', example: 'I am excited about my birthday party.' },
  { word: 'Nervous', arabicWord: 'قلق / متوتر', arabicDefinition: 'شعور بعدم الارتياح والتوتر قبل حدث مهم', example: 'He was nervous before his exam.' },
  { word: 'Proud', arabicWord: 'فخور', arabicDefinition: 'شعور بالرضا عن نفسك أو عن شخص تحبه', example: 'She was proud of her good grades.' },
  { word: 'Bored', arabicWord: 'ممل / يشعر بالملل', arabicDefinition: 'شعور بعدم الاهتمام لأنه لا يوجد ما يفعله', example: 'He felt bored with nothing to do.' },
  { word: 'Confused', arabicWord: 'محتار', arabicDefinition: 'شعور بعدم الفهم أو عدم اليقين من شيء ما', example: 'She was confused by the math problem.' },
  { word: 'Calm', arabicWord: 'هادئ', arabicDefinition: 'شعور بالسكينة والراحة وعدم الاضطراب', example: 'Take a deep breath to feel calm.' },
  { word: 'Jealous', arabicWord: 'غيور', arabicDefinition: 'شعور بعدم الرضا عند رؤية شخص آخر يملك ما تريده', example: 'He felt jealous of his friend\'s new bike.' },
  { word: 'Grateful', arabicWord: 'ممتنّ', arabicDefinition: 'شعور بالشكر والتقدير لشيء جميل فعله شخص ما', example: 'She was grateful for the help.' },
  { word: 'Lonely', arabicWord: 'وحيد', arabicDefinition: 'شعور بالوحدة والحاجة إلى رفقة الآخرين', example: 'He felt lonely when his friends were away.' },
  { word: 'Hopeful', arabicWord: 'متفائل', arabicDefinition: 'شعور بتوقع حدوث شيء جيد في المستقبل', example: 'She was hopeful about the results.' },
  { word: 'Frustrated', arabicWord: 'محبط', arabicDefinition: 'شعور بالضيق عندما يصعب تحقيق شيء تريده', example: 'He felt frustrated with the hard puzzle.' },
  { word: 'Embarrassed', arabicWord: 'محرج', arabicDefinition: 'شعور بالخجل أمام الآخرين بعد موقف مزعج', example: 'She was embarrassed when she fell in class.' },
  { word: 'Anxious', arabicWord: 'قلق / يشعر بالوسواس', arabicDefinition: 'شعور بالقلق الشديد والخوف مما قد يحدث في المستقبل', example: 'She felt anxious before the big test.' },
  { word: 'Melancholy', arabicWord: 'حزن عميق / كآبة', arabicDefinition: 'شعور بحزن هادئ وعميق يستمر لفترة طويلة', example: 'The rainy weather gave him a melancholy feeling.' },
  { word: 'Compassionate', arabicWord: 'متعاطف', arabicDefinition: 'شعور بالرغبة في مساعدة الآخرين والتخفيف من ألمهم', example: 'She was compassionate toward the hurt animal.' },
  { word: 'Motivated', arabicWord: 'متحفز', arabicDefinition: 'شعور بالرغبة القوية والطاقة للعمل نحو هدف ما', example: 'He felt motivated to study hard.' },
  { word: 'Overwhelmed', arabicWord: 'مثقل / مرهق', arabicDefinition: 'شعور بالعجز أمام الكثير من المهام أو المشاعر في وقت واحد', example: 'She felt overwhelmed by all the homework.' },
  { word: 'Disappointed', arabicWord: 'خائب الأمل', arabicDefinition: 'شعور بالحزن عندما لا يتحقق شيء كنت تتمناه', example: 'He was disappointed when the trip was cancelled.' },
  { word: 'Nostalgic', arabicWord: 'يشعر بالحنين', arabicDefinition: 'شعور بالحنين والشوق إلى أشخاص أو أماكن أو أوقات مضت', example: 'The old song made her feel nostalgic.' },
  { word: 'Euphoric', arabicWord: 'في قمة السعادة', arabicDefinition: 'شعور بسعادة شديدة وفرح غامر لا يوصف', example: 'He felt euphoric when he won the championship.' },
  { word: 'Apprehensive', arabicWord: 'مترقّب بقلق', arabicDefinition: 'شعور بالقلق الحذر من شيء مجهول أو محتمل الحدوث', example: 'She was apprehensive about the new school.' },
  { word: 'Indignant', arabicWord: 'مستاء / غاضب من ظلم', arabicDefinition: 'شعور بالغضب الشديد بسبب موقف ظالم أو غير عادل', example: 'He felt indignant when blamed unfairly.' },
  { word: 'Exhilarated', arabicWord: 'منتشٍ بالبهجة', arabicDefinition: 'شعور بالنشاط والحيوية والبهجة الشديدة', example: 'She felt exhilarated after the roller coaster.' },
  { word: 'Despondent', arabicWord: 'يائس / فاقد الأمل', arabicDefinition: 'شعور باليأس وفقدان الأمل في التحسن', example: 'He became despondent after many failures.' },
  ],
  science: [
  { word: 'Fire', arabicWord: 'نار', arabicDefinition: 'ضوء وحرارة ينتجان عن احتراق المواد', example: 'Fire is hot and bright.' },
  { word: 'Ice', arabicWord: 'ثلج', arabicDefinition: 'الماء المتجمد بسبب البرودة الشديدة', example: 'The ice is very cold.' },
  { word: 'Air', arabicWord: 'هواء', arabicDefinition: 'الغاز الذي نتنفسه وهو غير مرئي من حولنا', example: 'We need air to breathe.' },
  { word: 'Light', arabicWord: 'ضوء', arabicDefinition: 'طاقة تجعلنا نرى الأشياء من حولنا', example: 'The light helps us see.' },
  { word: 'Sound', arabicWord: 'صوت', arabicDefinition: 'اهتزازات في الهواء نسمعها بآذاننا', example: 'The sound of music is beautiful.' },
  { word: 'Energy', arabicWord: 'طاقة', arabicDefinition: 'القدرة على القيام بالعمل والحركة والتغيير', example: 'The sun gives us energy.' },
  { word: 'Magnet', arabicWord: 'مغناطيس', arabicDefinition: 'مادة تجذب المعادن مثل الحديد بقوة طبيعية', example: 'The magnet attracts iron nails.' },
  { word: 'Gravity', arabicWord: 'جاذبية', arabicDefinition: 'القوة التي تسحب الأشياء نحو الأرض', example: 'Gravity keeps us on the ground.' },
  { word: 'Atom', arabicWord: 'ذرة', arabicDefinition: 'أصغر وحدة في المادة لا يمكن تقسيمها بأساليب كيميائية', example: 'Everything is made of atoms.' },
  { word: 'Cell', arabicWord: 'خلية', arabicDefinition: 'الوحدة الأساسية في جسم الكائنات الحية', example: 'Our body is made of many cells.' },
  { word: 'Oxygen', arabicWord: 'أكسجين', arabicDefinition: 'غاز في الهواء يحتاجه الإنسان للتنفس', example: 'Plants produce oxygen for us.' },
  { word: 'Carbon', arabicWord: 'كربون', arabicDefinition: 'عنصر كيميائي أساسي في جميع الكائنات الحية', example: 'Carbon is found in all living things.' },
  { word: 'Molecule', arabicWord: 'جزيء', arabicDefinition: 'مجموعة صغيرة من الذرات مرتبطة معاً', example: 'Water is made of water molecules.' },
  { word: 'Chemical', arabicWord: 'كيميائي', arabicDefinition: 'مادة بخصائص تحددها تركيبتها الذرية', example: 'Some chemicals can be dangerous.' },
  { word: 'Electric', arabicWord: 'كهربائي', arabicDefinition: 'يتعلق بالكهرباء أو يعمل بها', example: 'Electric cars don\'t use fuel.' },
  { word: 'Radiation', arabicWord: 'إشعاع', arabicDefinition: 'طاقة تنبعث على شكل موجات أو جسيمات من مواد معينة', example: 'The sun emits radiation.' },
  { word: 'Bacteria', arabicWord: 'بكتيريا', arabicDefinition: 'كائنات حية مجهرية وحيدة الخلية موجودة في كل مكان', example: 'Some bacteria can cause illness.' },
  { word: 'Experiment', arabicWord: 'تجربة علمية', arabicDefinition: 'إجراء اختبار علمي منظم للتحقق من فرضية معينة', example: 'We did an experiment with water.' },
  { word: 'Photon', arabicWord: 'فوتون', arabicDefinition: 'الجسيم الأصغر من الضوء الذي يحمل طاقة كهرومغناطيسية', example: 'Light travels as photons.' },
  { word: 'Nucleus', arabicWord: 'نواة', arabicDefinition: 'المركز الذي يحتوي على معظم كتلة الذرة أو الخلية', example: 'The nucleus controls the cell.' },
  { word: 'Enzyme', arabicWord: 'إنزيم', arabicDefinition: 'بروتين يُسرّع التفاعلات الكيميائية في الجسم', example: 'Enzymes help digest food.' },
  { word: 'Protein', arabicWord: 'بروتين', arabicDefinition: 'جزيء كبير يبني خلايا الجسم ويؤدي وظائف حيوية متعددة', example: 'Eggs and meat are rich in protein.' },
  { word: 'Hypothesis', arabicWord: 'فرضية', arabicDefinition: 'تخمين علمي قابل للاختبار يُقترح لتفسير ظاهرة ما', example: 'The scientist tested her hypothesis.' },
  { word: 'Density', arabicWord: 'كثافة', arabicDefinition: 'مقدار الكتلة في حجم معين من المادة', example: 'Gold has a high density.' },
  { word: 'Chromosome', arabicWord: 'كروموسوم', arabicDefinition: 'بنية داخل نواة الخلية تحمل المعلومات الوراثية', example: 'Humans have 46 chromosomes.' },
  { word: 'Quantum', arabicWord: 'كمومي / كوانتم', arabicDefinition: 'يتعلق بالفيزياء الكمية التي تدرس سلوك الجسيمات الأصغر', example: 'Quantum physics is very complex.' },
  { word: 'Mitochondria', arabicWord: 'الميتوكوندريا', arabicDefinition: 'العضية في الخلية التي تنتج الطاقة اللازمة للوظائف الحيوية', example: 'Mitochondria are the powerhouse of the cell.' },
  { word: 'Electromagnetic', arabicWord: 'كهرومغناطيسي', arabicDefinition: 'يتعلق بالقوة التي تجمع بين الكهرباء والمغناطيسية معاً', example: 'Light is an electromagnetic wave.' },
  { word: 'Thermodynamics', arabicWord: 'ديناميكا حرارية', arabicDefinition: 'فرع الفيزياء الذي يدرس العلاقة بين الحرارة والطاقة والشغل', example: 'Thermodynamics explains how engines work.' },
  { word: 'Photosynthesis', arabicWord: 'التمثيل الضوئي', arabicDefinition: 'عملية تحويل النباتات ضوء الشمس إلى غذاء باستخدام ثاني أكسيد الكربون والماء', example: 'Plants use photosynthesis to make food.' },
  ],
  transportation: [
  { word: 'Car', arabicWord: 'سيارة', arabicDefinition: 'مركبة بأربعة عجلات تسير على الطريق', example: 'My dad drives a red car.' },
  { word: 'Bus', arabicWord: 'حافلة', arabicDefinition: 'مركبة كبيرة تنقل كثيراً من الركاب في وقت واحد', example: 'I go to school by bus.' },
  { word: 'Plane', arabicWord: 'طائرة', arabicDefinition: 'مركبة تطير في الجو وتنقل الركاب بين المدن والدول', example: 'We took a plane to visit grandma.' },
  { word: 'Train', arabicWord: 'قطار', arabicDefinition: 'مركبة تسير على قضبان حديدية وتنقل الركاب والبضائع', example: 'The train is fast and comfortable.' },
  { word: 'Boat', arabicWord: 'قارب', arabicDefinition: 'مركبة صغيرة تتحرك على الماء', example: 'We rode a boat on the river.' },
  { word: 'Road', arabicWord: 'طريق', arabicDefinition: 'مسار مرصوف تسير عليه السيارات والناس', example: 'The road leads to the city.' },
  { word: 'Bicycle', arabicWord: 'دراجة هوائية', arabicDefinition: 'مركبة بعجلتين تسير بتحريك الدواسات بالقدم', example: 'She rides her bicycle to school.' },
  { word: 'Truck', arabicWord: 'شاحنة', arabicDefinition: 'مركبة كبيرة قوية لنقل البضائع الثقيلة', example: 'The truck carries heavy boxes.' },
  { word: 'Taxi', arabicWord: 'سيارة أجرة', arabicDefinition: 'سيارة يقودها سائق مقابل أجر لنقل الركاب', example: 'We took a taxi to the airport.' },
  { word: 'Ferry', arabicWord: 'عبّارة', arabicDefinition: 'سفينة تنقل الناس والسيارات عبر الأنهار أو البحار القصيرة', example: 'The ferry crosses the river every hour.' },
  { word: 'Helicopter', arabicWord: 'مروحية', arabicDefinition: 'مركبة جوية ترفعها مراوح دوّارة وتهبط عمودياً', example: 'The helicopter landed on the roof.' },
  { word: 'Bridge', arabicWord: 'جسر', arabicDefinition: 'منشأة تمتد فوق الأنهار أو الوديان لتتيح العبور', example: 'We drove over the bridge.' },
  { word: 'Subway', arabicWord: 'مترو', arabicDefinition: 'قطار يسير تحت الأرض داخل المدن الكبيرة', example: 'The subway is faster than the bus.' },
  { word: 'Highway', arabicWord: 'طريق سريع', arabicDefinition: 'طريق عريض وسريع لربط المدن ببعضها', example: 'The highway connects the two cities.' },
  { word: 'Airport', arabicWord: 'مطار', arabicDefinition: 'المكان الذي تُقلع منه الطائرات وتهبط فيه', example: 'We arrived at the airport early.' },
  { word: 'Station', arabicWord: 'محطة', arabicDefinition: 'مكان توقف وسائل النقل لركوب وترك المسافرين', example: 'The train station is very busy.' },
  { word: 'Engine', arabicWord: 'محرك', arabicDefinition: 'الجهاز الذي يولد القوة لتحريك المركبة', example: 'The engine of the car is powerful.' },
  { word: 'Fuel', arabicWord: 'وقود', arabicDefinition: 'مادة كالبنزين أو الديزل تُحرق لإنتاج الطاقة', example: 'The car needs fuel to move.' },
  { word: 'Navigation', arabicWord: 'ملاحة', arabicDefinition: 'عملية تحديد المسار الصحيح للوصول من مكان إلى آخر', example: 'GPS helps with navigation.' },
  { word: 'Turbine', arabicWord: 'توربين', arabicDefinition: 'آلة تحوّل طاقة الماء أو الهواء أو البخار إلى قوة دوران', example: 'The turbine generates electricity.' },
  { word: 'Propeller', arabicWord: 'مروحة دفع', arabicDefinition: 'جهاز دوار بشفرات يدفع الطائرة أو السفينة للأمام', example: 'The propeller spins very fast.' },
  { word: 'Satellite', arabicWord: 'قمر صناعي', arabicDefinition: 'جهاز يدور حول الأرض ويُستخدم في الاتصالات والملاحة', example: 'Satellites help us navigate.' },
  { word: 'Traffic', arabicWord: 'حركة مرور', arabicDefinition: 'تدفق السيارات والمركبات على الطرق في وقت معين', example: 'There is a lot of traffic in the morning.' },
  { word: 'Infrastructure', arabicWord: 'بنية تحتية', arabicDefinition: 'المنشآت الأساسية كالطرق والجسور التي تدعم المجتمع', example: 'Good infrastructure helps people travel easily.' },
  { word: 'Locomotive', arabicWord: 'قاطرة', arabicDefinition: 'المحرك القوي الذي يجر عربات القطار', example: 'The locomotive pulls many carriages.' },
  { word: 'Aerodynamics', arabicWord: 'ديناميكا الهواء', arabicDefinition: 'علم دراسة حركة الأجسام في الهواء وتأثير الهواء عليها', example: 'Aerodynamics makes planes fly efficiently.' },
  { word: 'Combustion', arabicWord: 'احتراق', arabicDefinition: 'التفاعل الكيميائي السريع بين الوقود والأكسجين ينتج حرارة وضوء', example: 'Combustion makes the engine work.' },
  { word: 'Supersonic', arabicWord: 'فوق صوتي', arabicDefinition: 'يتحرك بسرعة أكبر من سرعة الصوت', example: 'Supersonic jets are extremely fast.' },
  { word: 'Hydrofoil', arabicWord: 'هيدروفويل', arabicDefinition: 'زعنفة تحت الماء ترفع جسم السفينة فوق السطح لتقليل الاحتكاك', example: 'A hydrofoil boat goes very fast.' },
  { word: 'Monorail', arabicWord: 'أحادي القضيب', arabicDefinition: 'قطار يسير على قضيب واحد مرتفع فوق الأرض', example: 'The monorail runs above the city streets.' },
  ],
  food: [
  { word: 'Bread', arabicWord: 'خبز', arabicDefinition: 'غذاء مخبوز من الدقيق يُؤكل يومياً', example: 'I eat bread with every meal.' },
  { word: 'Milk', arabicWord: 'حليب', arabicDefinition: 'سائل أبيض من الحيوانات يمد الجسم بالكالسيوم', example: 'Drink your milk every morning.' },
  { word: 'Fruit', arabicWord: 'فاكهة', arabicDefinition: 'غذاء حلو ينمو على الأشجار وهو صحي جداً', example: 'Apples and bananas are fruit.' },
  { word: 'Rice', arabicWord: 'أرز', arabicDefinition: 'حبوب بيضاء صغيرة تُطبخ وتؤكل في كثير من الدول', example: 'We eat rice for lunch.' },
  { word: 'Egg', arabicWord: 'بيضة', arabicDefinition: 'غذاء بيضاوي يضعه الطائر ويُستخدم في الطبخ', example: 'I like fried eggs for breakfast.' },
  { word: 'Chicken', arabicWord: 'دجاج', arabicDefinition: 'طائر منزلي يُربّى للحصول على لحمه وبيضه', example: 'We had grilled chicken for dinner.' },
  { word: 'Vegetable', arabicWord: 'خضار', arabicDefinition: 'نبات أو جزء منه يُؤكل ويمد الجسم بالفيتامينات', example: 'Carrots and peas are vegetables.' },
  { word: 'Cheese', arabicWord: 'جبن', arabicDefinition: 'غذاء يُصنع من الحليب وله أنواع ونكهات عديدة', example: 'I like cheese on my sandwich.' },
  { word: 'Juice', arabicWord: 'عصير', arabicDefinition: 'سائل يُستخرج من الفاكهة أو الخضار الطازجة', example: 'She drinks orange juice every day.' },
  { word: 'Salad', arabicWord: 'سلطة', arabicDefinition: 'طبق مكوّن من خضار طازجة مقطعة مع صلصة', example: 'The salad is fresh and healthy.' },
  { word: 'Soup', arabicWord: 'شوربة', arabicDefinition: 'طبق سائل ساخن يُطبخ من الخضار أو اللحم أو الدجاج', example: 'She made chicken soup for dinner.' },
  { word: 'Fish', arabicWord: 'سمك', arabicDefinition: 'حيوان مائي يُؤكل ويحتوي على بروتينات وأوميغا-3 مفيدة', example: 'We eat fish every Friday.' },
  { word: 'Pasta', arabicWord: 'معكرونة', arabicDefinition: 'طعام مصنوع من الدقيق والماء يأتي بأشكال مختلفة', example: 'I love pasta with tomato sauce.' },
  { word: 'Chocolate', arabicWord: 'شوكولاتة', arabicDefinition: 'حلوى لذيذة تُصنع من بذور الكاكاو', example: 'Dark chocolate is her favorite.' },
  { word: 'Sandwich', arabicWord: 'ساندويتش', arabicDefinition: 'وجبة مؤلفة من قطعتَي خبز بينهما حشوة', example: 'He made a cheese sandwich for lunch.' },
  { word: 'Yogurt', arabicWord: 'زبادي', arabicDefinition: 'منتج حليب متخمر كريمي ومفيد للجهاز الهضمي', example: 'She eats yogurt with honey.' },
  { word: 'Honey', arabicWord: 'عسل', arabicDefinition: 'سائل حلو اللون الذهبي تنتجه النحل من رحيق الزهور', example: 'Honey is sweet and healthy.' },
  { word: 'Potato', arabicWord: 'بطاطا', arabicDefinition: 'خضار دُرنيّ ينمو تحت الأرض ويُطبخ بطرق عديدة', example: 'French fries are made from potatoes.' },
  { word: 'Ingredient', arabicWord: 'مكوّن', arabicDefinition: 'أي مادة غذائية تدخل في إعداد وجبة أو وصفة', example: 'Sugar is an ingredient in cake.' },
  { word: 'Protein', arabicWord: 'بروتين', arabicDefinition: 'مادة غذائية أساسية في اللحوم والبيض تبني عضلات الجسم', example: 'Protein helps your muscles grow.' },
  { word: 'Vitamin', arabicWord: 'فيتامين', arabicDefinition: 'مادة طبيعية في الغذاء يحتاجها الجسم بكميات صغيرة للصحة', example: 'Oranges have vitamin C.' },
  { word: 'Calorie', arabicWord: 'سعرة حرارية', arabicDefinition: 'وحدة قياس الطاقة التي نحصل عليها من الطعام', example: 'Exercise burns calories.' },
  { word: 'Recipe', arabicWord: 'وصفة', arabicDefinition: 'تعليمات خطوة بخطوة لإعداد طبق أو وجبة معينة', example: 'She followed the recipe carefully.' },
  { word: 'Nutrition', arabicWord: 'تغذية', arabicDefinition: 'علم دراسة المواد الغذائية وتأثيرها على صحة الجسم', example: 'Good nutrition keeps you healthy.' },
  { word: 'Fermentation', arabicWord: 'تخمير', arabicDefinition: 'عملية تحويل السكريات إلى كحول أو حمض بفعل الخمائر أو البكتيريا', example: 'Fermentation is used to make yogurt.' },
  { word: 'Cuisine', arabicWord: 'مطبخ / فن الطهو', arabicDefinition: 'أسلوب الطبخ الخاص بثقافة أو بلد معين', example: 'Italian cuisine is famous worldwide.' },
  { word: 'Gastronomy', arabicWord: 'علم الأكل الراقي', arabicDefinition: 'دراسة العلاقة بين الثقافة وفن الطبخ والغذاء', example: 'Gastronomy is about enjoying fine food.' },
  { word: 'Metabolism', arabicWord: 'أيض / استقلاب', arabicDefinition: 'مجموع التفاعلات الكيميائية في الجسم لتحويل الغذاء إلى طاقة', example: 'A fast metabolism burns energy quickly.' },
  { word: 'Appetite', arabicWord: 'شهية', arabicDefinition: 'الرغبة الطبيعية في تناول الطعام والإحساس بالجوع', example: 'Exercise gives you a good appetite.' },
  { word: 'Delicacy', arabicWord: 'أطعمة شهية نادرة', arabicDefinition: 'طعام نادر أو فاخر يُعدّ من التجارب الغذائية المميزة', example: 'Truffles are a rare delicacy.' },
  ],
};

export function getPhaseVocabulary(phaseIndex) {
  const perPhase = 6;
  const result = {};
  for (const cat of CATEGORIES) {
    const bank = WORD_BANK[cat.id];
    const bankSize = bank.length;
    const cycleLen = Math.floor(bankSize / perPhase); // 5
    const cycle = Math.floor(phaseIndex / cycleLen);
    const slot  = phaseIndex % cycleLen;
    const start = ((slot * perPhase) + (cycle * 2)) % bankSize;
    const indices = Array.from({ length: perPhase }, (_, i) => (start + i) % bankSize);
    result[cat.id] = indices.map(idx => bank[idx]);
  }
  return result;
}

export function getPhaseQuiz(phaseIndex, categoryId) {
  const phaseWords = getPhaseVocabulary(phaseIndex)[categoryId];
  const bank = WORD_BANK[categoryId];
  const skipIdx = phaseIndex % phaseWords.length;
  const qWords  = phaseWords.filter((_, i) => i !== skipIdx);
  return qWords.map((targetWord, qi) => {
    const distractors = [];
    let di = (phaseIndex * 7 + qi * 3 + 1) % bank.length;
    while (distractors.length < 3) {
      const candidate = bank[di % bank.length];
      if (candidate.word !== targetWord.word &&
          !distractors.find(d => d.word === candidate.word)) {
        distractors.push(candidate);
      }
      di++;
    }
    const correctPos = (phaseIndex + qi) % 4;
    const options = [
      ...distractors.slice(0, correctPos),
      targetWord,
      ...distractors.slice(correctPos),
    ];
    return {
      question: targetWord.arabicDefinition + ' — ما الكلمة الإنجليزية الصحيحة؟',
      options: options.map(o => o.word),
      answer: correctPos,
    };
  });
}

export const VOCABULARY = getPhaseVocabulary(0);
export const QUIZZES = Object.fromEntries(CATEGORIES.map(cat => [cat.id, getPhaseQuiz(0, cat.id)]));
