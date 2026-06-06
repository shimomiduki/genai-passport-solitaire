// 生成AIパスポート 用語データベース
// category: basic(基礎) / model(仕組み) / prompt(プロンプト) / ethics(倫理・法律) / use(利活用)
// term: 用語  /  meaning: 短い意味（カードに収まる長さ）

const TERM_DATA = [
  // ===== 基礎 =====
  { category: "basic", term: "AI", meaning: "人間の知的活動をコンピュータで再現する技術" },
  { category: "basic", term: "機械学習", meaning: "データから規則性を自動で学習する手法" },
  { category: "basic", term: "深層学習", meaning: "多層ニューラルネットを用いた機械学習" },
  { category: "basic", term: "ニューラルネットワーク", meaning: "脳の神経細胞を模した数理モデル" },
  { category: "basic", term: "教師あり学習", meaning: "正解ラベル付きデータで学習する方法" },
  { category: "basic", term: "教師なし学習", meaning: "正解なしでデータの構造を見つける方法" },
  { category: "basic", term: "強化学習", meaning: "報酬を最大化する行動を試行錯誤で学ぶ" },
  { category: "basic", term: "過学習", meaning: "訓練データに適合しすぎて汎化性能が下がる" },
  { category: "basic", term: "汎化", meaning: "未知のデータにも対応できる能力" },
  { category: "basic", term: "特徴量", meaning: "予測に使うデータの特徴を表す変数" },

  // ===== 生成AIの仕組み =====
  { category: "model", term: "生成AI", meaning: "文章や画像など新しいデータを作るAI" },
  { category: "model", term: "LLM", meaning: "大量のテキストで学習した大規模言語モデル" },
  { category: "model", term: "Transformer", meaning: "Attentionを用いた生成AIの基盤構造" },
  { category: "model", term: "トークン", meaning: "文章を分割した処理の最小単位" },
  { category: "model", term: "パラメータ", meaning: "モデルが学習で調整する内部の重み" },
  { category: "model", term: "アテンション", meaning: "文中の重要な語に注目する仕組み" },
  { category: "model", term: "事前学習", meaning: "大規模データで汎用的に学ばせる工程" },
  { category: "model", term: "ファインチューニング", meaning: "既存モデルを特定用途に追加学習する" },
  { category: "model", term: "拡散モデル", meaning: "ノイズ除去を繰り返し画像を生成する手法" },
  { category: "model", term: "GAN", meaning: "生成器と識別器を競わせる生成手法" },
  { category: "model", term: "マルチモーダル", meaning: "文字・画像・音声など複数種を扱うAI" },
  { category: "model", term: "埋め込み", meaning: "言葉を数値ベクトルで表現したもの" },

  // ===== プロンプト =====
  { category: "prompt", term: "プロンプト", meaning: "生成AIへの指示・入力文" },
  { category: "prompt", term: "プロンプトエンジニアリング", meaning: "意図通りの出力を引き出す指示の工夫" },
  { category: "prompt", term: "Zero-shot", meaning: "例を与えずに指示だけで答えさせる方法" },
  { category: "prompt", term: "Few-shot", meaning: "少数の例を示して回答精度を高める方法" },
  { category: "prompt", term: "Chain of Thought", meaning: "途中の思考過程を順に書かせる手法" },
  { category: "prompt", term: "システムプロンプト", meaning: "AIの役割や前提を定める基本指示" },
  { category: "prompt", term: "RAG", meaning: "外部情報を検索し回答に活用する仕組み" },
  { category: "prompt", term: "温度(Temperature)", meaning: "出力のランダム性を調整する設定値" },
  { category: "prompt", term: "コンテキスト", meaning: "AIが一度に扱える入力の文脈・範囲" },

  // ===== 倫理・法律 =====
  { category: "ethics", term: "ハルシネーション", meaning: "事実でない内容をもっともらしく生成する" },
  { category: "ethics", term: "バイアス", meaning: "学習データの偏りによる不公平な出力" },
  { category: "ethics", term: "著作権", meaning: "創作物の利用を保護する権利" },
  { category: "ethics", term: "個人情報保護法", meaning: "個人データの適正な取扱いを定めた法律" },
  { category: "ethics", term: "ディープフェイク", meaning: "AIで作る本物そっくりの偽の音声・映像" },
  { category: "ethics", term: "透明性", meaning: "AIの判断根拠を明らかにする考え方" },
  { category: "ethics", term: "説明可能性(XAI)", meaning: "AIの出力理由を人が理解できる性質" },
  { category: "ethics", term: "プロンプトインジェクション", meaning: "不正な指示でAIを誤動作させる攻撃" },
  { category: "ethics", term: "AI倫理", meaning: "AIを公正・安全に使うための原則" },
  { category: "ethics", term: "オプトアウト", meaning: "データ利用を本人が拒否できる仕組み" },

  // ===== 利活用・リスク =====
  { category: "use", term: "ChatGPT", meaning: "OpenAIが提供する対話型生成AI" },
  { category: "use", term: "Copilot", meaning: "作業を補助するAIアシスタント機能" },
  { category: "use", term: "機密情報漏洩", meaning: "入力した社内情報が外部に流出するリスク" },
  { category: "use", term: "知的財産", meaning: "発明やデザインなど創作の財産的権利" },
  { category: "use", term: "ガイドライン", meaning: "AIを安全に使うための社内ルールや指針" },
  { category: "use", term: "ファクトチェック", meaning: "生成結果の事実確認を行うこと" },
  { category: "use", term: "API", meaning: "外部からAI機能を呼び出す接続口" },
  { category: "use", term: "プロンプトテンプレート", meaning: "再利用できる定型の指示文の雛形" },

  // ===== 基礎（追加） =====
  { category: "basic", term: "アルゴリズム", meaning: "問題を解くための計算手順" },
  { category: "basic", term: "ビッグデータ", meaning: "膨大で多様な大規模データ群" },
  { category: "basic", term: "データセット", meaning: "学習に使うデータの集まり" },
  { category: "basic", term: "テストデータ", meaning: "性能評価に使う未知のデータ" },
  { category: "basic", term: "アノテーション", meaning: "データに正解ラベルを付ける作業" },
  { category: "basic", term: "分類", meaning: "データをカテゴリに振り分けるタスク" },
  { category: "basic", term: "回帰", meaning: "連続する数値を予測するタスク" },
  { category: "basic", term: "クラスタリング", meaning: "似たデータをグループ分けする手法" },
  { category: "basic", term: "推論", meaning: "学習済みモデルで予測・出力する処理" },
  { category: "basic", term: "損失関数", meaning: "予測と正解の誤差を測る指標" },
  { category: "basic", term: "学習率", meaning: "重みを更新する際の調整幅" },
  { category: "basic", term: "チューリングテスト", meaning: "人間と区別できるか試す判定方法" },
  { category: "basic", term: "シンギュラリティ", meaning: "AIが人知を超える技術的特異点" },
  { category: "basic", term: "特化型AI", meaning: "特定タスクに特化したAI" },
  { category: "basic", term: "汎用人工知能(AGI)", meaning: "人間並みに何でもこなすAI" },

  // ===== 生成AIの仕組み（追加） =====
  { category: "model", term: "基盤モデル", meaning: "多用途に応用できる大規模学習モデル" },
  { category: "model", term: "自然言語処理(NLP)", meaning: "人間の言葉を扱うAI技術" },
  { category: "model", term: "自己教師あり学習", meaning: "データ自身から正解を作り学ぶ手法" },
  { category: "model", term: "RLHF", meaning: "人間の評価で出力を調整する学習" },
  { category: "model", term: "蒸留", meaning: "大型モデルの知識を小型に移す手法" },
  { category: "model", term: "量子化", meaning: "モデルを軽量化し高速化する技術" },
  { category: "model", term: "コンテキストウィンドウ", meaning: "一度に扱える文脈量の上限" },
  { category: "model", term: "エンコーダ", meaning: "入力を内部表現に変換する部分" },
  { category: "model", term: "デコーダ", meaning: "内部表現から出力を生成する部分" },
  { category: "model", term: "Top-p", meaning: "確率上位から候補を絞る生成方式" },
  { category: "model", term: "VAE", meaning: "圧縮と復元で学習する生成モデル" },
  { category: "model", term: "画像生成AI", meaning: "文章から画像を作り出すAI" },

  // ===== プロンプト（追加） =====
  { category: "prompt", term: "One-shot", meaning: "例を1つ示して答えさせる方法" },
  { category: "prompt", term: "ロールプロンプト", meaning: "AIに役割を演じさせる指示" },
  { category: "prompt", term: "制約条件", meaning: "出力の形式や条件を指定する指示" },
  { category: "prompt", term: "出力フォーマット指定", meaning: "表や箇条書きなど形を指定すること" },
  { category: "prompt", term: "ステップバイステップ", meaning: "段階的に順を追って考えさせる指示" },
  { category: "prompt", term: "再プロンプト", meaning: "結果を見て指示を出し直すこと" },
  { category: "prompt", term: "グラウンディング", meaning: "事実情報に基づかせること" },
  { category: "prompt", term: "ネガティブプロンプト", meaning: "生成したくない要素を指定する指示" },

  // ===== 倫理・法律（追加） =====
  { category: "ethics", term: "人間中心のAI社会原則", meaning: "日本が定めたAI活用の基本原則" },
  { category: "ethics", term: "GDPR", meaning: "EUの個人データ保護規則" },
  { category: "ethics", term: "EU AI Act", meaning: "EUのAIを規制する法律" },
  { category: "ethics", term: "公平性", meaning: "特定の集団に不利益を与えない考え" },
  { category: "ethics", term: "説明責任", meaning: "結果に対し責任を負い説明すること" },
  { category: "ethics", term: "プライバシー", meaning: "私生活に関する情報を守ること" },
  { category: "ethics", term: "肖像権", meaning: "容姿を無断で利用されない権利" },
  { category: "ethics", term: "パブリシティ権", meaning: "著名人の名前や顔の経済的権利" },
  { category: "ethics", term: "フェイクニュース", meaning: "事実を装った偽の情報" },
  { category: "ethics", term: "AIガバナンス", meaning: "組織的にAIリスクを管理する体制" },
  { category: "ethics", term: "トレーサビリティ", meaning: "判断過程を追跡・検証できる性質" },
  { category: "ethics", term: "誤情報", meaning: "事実と異なる誤った情報" },

  // ===== 利活用・リスク（追加） =====
  { category: "use", term: "業務効率化", meaning: "AI活用で作業を速く楽にすること" },
  { category: "use", term: "DX", meaning: "デジタル技術で業務を変革すること" },
  { category: "use", term: "要約", meaning: "長文の要点を短くまとめる活用" },
  { category: "use", term: "翻訳", meaning: "言語間で文章を変換する活用" },
  { category: "use", term: "コード生成", meaning: "プログラムをAIに書かせる活用" },
  { category: "use", term: "画像認識", meaning: "画像の内容をAIが識別する技術" },
  { category: "use", term: "音声認識", meaning: "音声を文字に変換する技術" },
  { category: "use", term: "音声合成", meaning: "文字を音声に変換する技術" },
  { category: "use", term: "チャットボット", meaning: "自動で会話応答するプログラム" },
  { category: "use", term: "商用利用", meaning: "生成物をビジネスで使うこと" },
  { category: "use", term: "利用規約", meaning: "サービス利用のルール・約束事" },
  { category: "use", term: "人によるレビュー", meaning: "AIの出力を人が点検する工程" },
];

const CATEGORIES = [
  { id: "all",    label: "ぜんぶ",       icon: "🎲" },
  { id: "basic",  label: "AIの基礎",     icon: "🧠" },
  { id: "model",  label: "生成AIの仕組み", icon: "⚙️" },
  { id: "prompt", label: "プロンプト",    icon: "💬" },
  { id: "ethics", label: "倫理・法律",    icon: "⚖️" },
  { id: "use",    label: "利活用・リスク", icon: "🚀" },
];

const DIFFICULTIES = [
  { id: "easy",   label: "やさしい", pairs: 4, time: 8 },
  { id: "normal", label: "ふつう",   pairs: 6, time: 6 },
  { id: "hard",   label: "むずかしい", pairs: 8, time: 5 },
];
