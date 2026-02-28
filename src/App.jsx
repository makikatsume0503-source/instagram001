import React, { useState, useEffect } from 'react';
import Slide from './components/Slide';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { DownloadCloud, Plus, Trash2, GripVertical, Sparkles, X, Save, FolderOpen } from 'lucide-react';
import { saveProject, loadProject, listProjects, deleteProject } from './firebase';

const defaultSlides = [
  {
    id: 'slide1',
    fileName: '01_cover.png',
    type: 'cover',
    bgImage: '/slide_cover_bg_navy_1772083156167.png',
    catchphrase: '「圧倒的な効率」と「プロの品質」を両立',
    title: '仕事の質を高める<br/>AIの<br/>活用事例 7選',
    footer: 'AI活用インストラクター FinEdit 勝目麻希'
  },
  {
    id: 'slide2',
    fileName: '02_usecase1.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_1_1772098805176.png',
    title: '【1】 文章作成',
    bullets: [
      'ブログ記事の執筆や骨組みの自動作成',
      'SNSの投稿文作成やハッシュタグ考案',
      '顧客へのメールや謝罪文のドラフト作成',
      'プレスリリースやPR文の叩き台作り',
      '長文の文章を「要約」や「箇条書き」に変換'
    ]
  },
  {
    id: 'slide3',
    fileName: '03_usecase2.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_2_1772099168623.png',
    title: '【2】 画像生成',
    bullets: [
      'SNSやブログ用のアイキャッチ画像の生成',
      'プレゼン資料の挿絵やイメージ画像の作成',
      'プロンプト１つで様々なテイスト（水彩・アニメ風等）の絵に',
      '自社商品の宣伝用「架空の使用イメージ」の作成'
    ]
  },
  {
    id: 'slide4',
    fileName: '04_usecase3.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_3_1772098574132.png',
    title: '【3】 資料作成',
    bullets: [
      '会議の録音データから「議事録」とToDoを自動抽出',
      '構成案を入力して「スライド・企画書」の叩き台を作成',
      'バラバラなデータを要約した「週次レポート」の出力',
      '新人研修用の「業務マニュアル」のフォーマット化'
    ]
  },
  {
    id: 'slide5',
    fileName: '05_usecase4.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_4_1772099435711.png',
    title: '【4】 ホームページ作成',
    bullets: [
      'LPやHPの「構成案」や「ワイヤーフレーム」を一瞬で作成',
      'ターゲットの心に刺さる「キャッチコピー」の複数提案',
      'デザインのベースとなるHTML/CSSコードの自動出力',
      'FAQや「よくある質問」の想定リスト作成'
    ]
  },
  {
    id: 'slide6',
    fileName: '06_usecase5.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_5_1772099463004.png',
    title: '【5】 アプリ作成',
    bullets: [
      'プログラミング不要で日々の業務アプリを構築',
      '顧客情報や日報を一元管理・検索できるシステム',
      'アイデアをその場で動く「カタチ」にする技術'
    ]
  },
  {
    id: 'slide7',
    fileName: '07_usecase6.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_6_research_1772102726728.png',
    title: '【6】 リサーチ・競合調査・情報整理',
    bullets: [
      '業界トレンドや長時間のYouTube動画の瞬時な要約',
      '競合他社の強み・弱みの自動分析と表組みでのリスト化',
      '海外の英語記事や最新論文を翻訳・要約してキャッチアップ',
      '散らばった情報やメモを構造的にマインドマップ形式で整理'
    ]
  },
  {
    id: 'slide8',
    fileName: '08_usecase7.png',
    type: 'list',
    bgImage: '/slide_usecase_bg_7_brainstorm_1772102753451.png',
    title: '【7】 アイデア出し・壁打ち',
    bullets: [
      '新規事業やイベント企画の「100本ノック（壁打ち）」',
      '経営の悩みに対する「客観的かつ論理的なアドバイス」',
      '理想のペルソナ（お客様像）の解像度アップと明確化',
      '新規プロジェクトの「予期せぬトラブル」の想定と対策案'
    ]
  },
  {
    id: 'slide9',
    fileName: '09_cta.png',
    type: 'cta',
    bgImage: '/slide_cta_bg_navy_1772083385434.png',
    title: 'AIは仕事を奪う脅威ではなく、<br>あなたの可能性を広げる<br>頼もしいパートナーです。',
    subtitle: 'まずは小さな業務から、<br>AIに任せてみませんか？',
    buttonText: '保存＆フォローして見返す'
  },
  {
    id: 'slide10',
    fileName: '10_profile.png',
    type: 'profile',
    bgImage: '/slide_cta_bg_navy_1772083385434.png',
    imageSrc: '/media__1772146648346.jpg',
    name: '勝目麻希',
    role: 'フリーランスライター・AI活用インストラクター',
    catchphrase: '言葉の力で心を動かし、<br>AIの力で可能性を広げる',
    services: [
      'AI活用講座',
      'AI導入サポート',
      'コンテンツ制作'
    ]
  }
];

function App() {
  const [slides, setSlides] = useState(defaultSlides);
  const [draftSlides, setDraftSlides] = useState(defaultSlides);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');

  // Theme and Styling State
  const [globalTheme, setGlobalTheme] = useState('navy'); // 'navy' or 'light'
  const [fontScale, setFontScale] = useState(1.0);

  // Firebase State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-sync draftSlides to slides for real-time preview
  useEffect(() => {
    setSlides(draftSlides);
  }, [draftSlides]);

  // Updates simple string properties in DRAFT
  const handleUpdateSlide = (id, field, value) => {
    setDraftSlides(draftSlides.map(slide =>
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  // Handles updating a specific string in an array in DRAFT
  const handleUpdateArrayItem = (id, arrayField, index, value) => {
    setDraftSlides(draftSlides.map(slide => {
      if (slide.id === id) {
        const newArray = [...slide[arrayField]];
        newArray[index] = value;
        return { ...slide, [arrayField]: newArray };
      }
      return slide;
    }));
  };

  // Adds a new item to an array field in DRAFT
  const handleAddArrayItem = (id, arrayField) => {
    setDraftSlides(draftSlides.map(slide => {
      if (slide.id === id) {
        return { ...slide, [arrayField]: [...slide[arrayField], ''] };
      }
      return slide;
    }));
  };

  // Removes an item from an array field in DRAFT
  const handleRemoveArrayItem = (id, arrayField, index) => {
    setDraftSlides(draftSlides.map(slide => {
      if (slide.id === id) {
        const newArray = [...slide[arrayField]];
        newArray.splice(index, 1);
        return { ...slide, [arrayField]: newArray };
      }
      return slide;
    }));
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    const zip = new JSZip();

    try {
      for (let i = 0; i < slides.length; i++) {
        const element = document.getElementById(slides[i].id);
        const originalTransform = element.style.transform;
        element.style.transform = 'scale(1)'; // restore to exact dimensions

        const dataUrl = await htmlToImage.toPng(element, {
          width: 1080,
          height: 1350,
          pixelRatio: 1
        });

        const base64Data = dataUrl.split(',')[1];
        zip.file(slides[i].fileName, base64Data, { base64: true });

        element.style.transform = originalTransform;
        await new Promise(resolve => setTimeout(resolve, 100)); // Breathing room
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'carousel_images.zip';
      link.click();
      URL.revokeObjectURL(link.href);

      alert('ZIPファイルのダウンロードが完了しました！');
    } catch (e) {
      console.error('ZIP Generation failed', e);
      alert('ZIPファイルの作成に失敗しました。');
    } finally {
      setIsDownloading(false);
    }
  };

  // ========================================
  // Firebase: 保存・読み込み
  // ========================================

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください。');
      return;
    }
    setIsSaving(true);
    try {
      // IDはプロジェクト名をスラッグ化（スペース→_）
      const projectId = projectName.trim().replace(/\s+/g, '_');
      await saveProject(projectId, draftSlides, globalTheme);
      alert(`「${projectName}」を保存しました！`);
      setIsSaveModalOpen(false);
      setProjectName('');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenLoadModal = async () => {
    setIsLoadModalOpen(true);
    setIsLoading(true);
    try {
      const projects = await listProjects();
      setSavedProjects(projects);
    } catch (e) {
      console.error(e);
      alert('一覧の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProject = async (projectId) => {
    try {
      const data = await loadProject(projectId);
      if (data) {
        setDraftSlides(data.slides);
        setSlides(data.slides);
        if (data.theme) setGlobalTheme(data.theme);
        setIsLoadModalOpen(false);
        alert(`「${projectId}」を読み込みました！\n\n【DEBUG】表紙キャッチコピー:\n「${data.slides?.[0]?.catchphrase || '(なし)'}」`);
      }
    } catch (e) {
      console.error(e);
      alert('読み込みに失敗しました。');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm(`「${projectId}」を削除しますか？`)) return;
    try {
      await deleteProject(projectId);
      setSavedProjects(savedProjects.filter(p => p.id !== projectId));
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました。');
    }
  };

  // Parses AI JSON and updates draft slides
  const handleAIImport = () => {
    try {
      const parsedData = JSON.parse(aiInputText);
      const newDrafts = [...draftSlides];

      parsedData.forEach((item, index) => {
        // Slide 1 (Cover)
        if (index === 0 && newDrafts[0].type === 'cover') {
          if (item.catchphrase) newDrafts[0].catchphrase = item.catchphrase;
          if (item.title) newDrafts[0].title = item.title;
        }

        // Slides 2-8 (List)
        if (index >= 1 && index <= 7 && newDrafts[index].type === 'list') {
          if (item.title) newDrafts[index].title = item.title;

          if (item.displayMode) {
            newDrafts[index].displayMode = item.displayMode;
          }

          // Auto-sensing from generic "content" key
          if (item.content) {
            if (Array.isArray(item.content)) {
              newDrafts[index].bullets = item.content;
              if (!item.displayMode) newDrafts[index].displayMode = 'bullets';
            } else if (typeof item.content === 'string') {
              // Check if string looks like a bulleted list (multiple lines starting with bullet symbols)
              const lines = item.content.split('\n').map(line => line.trim()).filter(line => line);
              const isList = lines.length > 1 && lines.every(line => /^[-・*•]\s*/.test(line));

              if (isList) {
                newDrafts[index].bullets = lines.map(line => line.replace(/^[-・*•]\s*/, ''));
                if (!item.displayMode) newDrafts[index].displayMode = 'bullets';
              } else {
                newDrafts[index].bodyText = item.content.replace(/\n/g, '<br>');
                if (!item.displayMode) newDrafts[index].displayMode = 'text';
              }
            }
          }

          if (item.bullets && Array.isArray(item.bullets)) {
            newDrafts[index].bullets = item.bullets;
            if (!item.displayMode) newDrafts[index].displayMode = 'bullets';
          }

          if (item.bodyText) {
            newDrafts[index].bodyText = item.bodyText;
            if (!item.displayMode) newDrafts[index].displayMode = 'text';
          }
        }
      });
      setDraftSlides(newDrafts);
      setSlides(newDrafts); // ← 即座にプレビューにも反映させる！
      setIsAIModalOpen(false);
      setAiInputText('');
      alert('AIデータの流し込みに成功し、プレビューにも反映しました！');
    } catch (error) {
      alert('データの解析に失敗しました。正しいJSON形式（配列）か確認してください。');
      console.error(error);
    }
  };

  // Helper to get background based on theme and slide type
  const getBackgroundImage = (slideType, originalBg) => {
    if (globalTheme === 'navy') return originalBg;

    // Map to light theme backgrounds
    if (slideType === 'cover') return '/digital_white_cover_v3_1772164707790.png';
    if (slideType === 'list') return '/digital_white_usecase_v2_1772164366186.png';
    if (slideType === 'cta' || slideType === 'profile') return '/digital_white_cta_v2_1772164380506.png';
    if (slideType === 'cta' || slideType === 'profile') return '/digital_white_cta_v2_1772164380506.png';
    return originalBg;
  };

  const FontSizeSlider = ({ slideId, fieldKey, value, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <label style={{ fontSize: '10px', color: '#8b949e', whiteSpace: 'nowrap', margin: 0 }}>{label || '文字サイズ'}</label>
      <input
        type="range"
        min="0.5"
        max="2.0"
        step="0.05"
        value={value || 1}
        onChange={(e) => handleUpdateSlide(slideId, fieldKey, parseFloat(e.target.value))}
        style={{ width: '60px', height: '4px' }}
      />
      <span style={{ fontSize: '10px', color: '#8b949e', width: '25px', textAlign: 'right' }}>{Math.round((value || 1) * 100)}%</span>
    </div>
  );

  return (
    <div className={`app-container ${globalTheme === 'light' ? 'theme-light' : ''}`} style={{ '--font-scale': fontScale }}>
      {/* Sidebar Editor */}
      <div className="editor-sidebar">
        <div className="editor-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>カルーセル編集エディタ</h1>
          </div>

          {/* Global Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#21262d', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#c9d1d9' }}>🎨 テーマカラー</label>
              <select
                value={globalTheme}
                onChange={(e) => setGlobalTheme(e.target.value)}
                style={{ padding: '4px 8px', backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="navy">ネイビー (シック)</option>
                <option value="light">ホワイト (クリーン・ネイビー装飾)</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#c9d1d9' }}>TEXT 文字サイズ調整</label>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                style={{ width: '120px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="download-all-btn"
              style={{ flex: 1, padding: '8px', fontSize: '13px', marginBottom: 0, justifyContent: 'center', background: '#30363d', color: '#c9d1d9', border: '1px solid #484f58', boxShadow: 'none' }}
              onClick={() => setIsAIModalOpen(true)}
            >
              <Sparkles size={16} color="#f4d990" /> AIから一括入力
            </button>
            <button
              className="download-all-btn"
              style={{ flex: 1, padding: '8px', fontSize: '13px', marginBottom: 0, justifyContent: 'center' }}
              onClick={handleDownloadAll}
              disabled={isDownloading}
            >
              <DownloadCloud size={16} />
              {isDownloading ? '生成中...' : '全10枚をZIPで保存'}
            </button>
          </div>

          {/* Firebase 保存・読み込みボタン */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="download-all-btn"
              style={{ flex: 1, padding: '8px', fontSize: '13px', marginBottom: 0, justifyContent: 'center', background: '#1a4731', color: '#3fb950', border: '1px solid #2ea043', boxShadow: 'none' }}
              onClick={() => setIsSaveModalOpen(true)}
            >
              <Save size={16} /> 保存する
            </button>
            <button
              className="download-all-btn"
              style={{ flex: 1, padding: '8px', fontSize: '13px', marginBottom: 0, justifyContent: 'center', background: '#1c2c4a', color: '#79c0ff', border: '1px solid #388bfd', boxShadow: 'none' }}
              onClick={handleOpenLoadModal}
            >
              <FolderOpen size={16} /> 読み込む
            </button>
          </div>
        </div>
        <div className="editor-content">
          {draftSlides.map((slide, sIndex) => (
            <div key={slide.id} className="section-card">
              <h2 className="section-title">
                {sIndex + 1}. {slide.type === 'cover' ? '表紙' : slide.type === 'cta' ? 'CTA' : slide.type === 'profile' ? 'プロフィール' : 'リスト'}
              </h2>

              {/* Cover Fields */}
              {slide.type === 'cover' && (
                <>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>キャッチコピー</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="catchphraseScale" value={slide.catchphraseScale} />
                    </div>
                    <input
                      type="text"
                      value={slide.catchphrase}
                      onChange={(e) => handleUpdateSlide(slide.id, 'catchphrase', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>タイトル (HTML可)</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="titleScale" value={slide.titleScale} />
                    </div>
                    <textarea
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* List Fields */}
              {slide.type === 'list' && (
                <>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>スライド見出し</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="titleScale" value={slide.titleScale} />
                    </div>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>アイコン設定</label>
                    <select
                      value={slide.icon || 'none'}
                      onChange={(e) => handleUpdateSlide(slide.id, 'icon', e.target.value)}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#0d1117',
                        border: '1px solid #30363d',
                        color: '#c9d1d9',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="text">アイコン: 文章作成 (Text)</option>
                      <option value="image">アイコン: 画像生成 (Image)</option>
                      <option value="docs">アイコン: 資料作成 (Docs)</option>
                      <option value="website">アイコン: Webサイト構築 (Website)</option>
                      <option value="app">アイコン: アプリ作成 (App)</option>
                      <option value="search">アイコン: リサーチ・分析 (Search)</option>
                      <option value="brain">アイコン: アイデア出し・思考 (Brain)</option>
                      <option value="none">アイコンなし (None)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                    <label style={{ margin: 0 }}>表示形式:</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#c9d1d9' }}>
                      <input
                        type="radio"
                        name={`displayMode-${slide.id}`}
                        value="bullets"
                        checked={!slide.displayMode || slide.displayMode === 'bullets'}
                        onChange={() => handleUpdateSlide(slide.id, 'displayMode', 'bullets')}
                      />
                      箇条書き
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#c9d1d9' }}>
                      <input
                        type="radio"
                        name={`displayMode-${slide.id}`}
                        value="text"
                        checked={slide.displayMode === 'text'}
                        onChange={() => handleUpdateSlide(slide.id, 'displayMode', 'text')}
                      />
                      フリーテキスト
                    </label>
                  </div>

                  {(!slide.displayMode || slide.displayMode === 'bullets') ? (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ margin: 0 }}>箇条書き</label>
                        <FontSizeSlider slideId={slide.id} fieldKey="bodyScale" value={slide.bodyScale} />
                      </div>
                      <div className="bullet-list-editor">
                        {slide.bullets?.map((b, bIdx) => (
                          <div key={bIdx} className="bullet-item">
                            <GripVertical size={18} color="#484f58" style={{ marginTop: '10px' }} />
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => handleUpdateArrayItem(slide.id, 'bullets', bIdx, e.target.value)}
                            />
                            <button className="icon-btn delete" onClick={() => handleRemoveArrayItem(slide.id, 'bullets', bIdx)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="add-btn" onClick={() => handleAddArrayItem(slide.id, 'bullets')}>
                        <Plus size={16} /> 項目を追加
                      </button>
                    </div>
                  ) : (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ margin: 0 }}>文章 (HTML可)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FontSizeSlider slideId={slide.id} fieldKey="bodyScale" value={slide.bodyScale} />
                          <button
                            className="add-btn"
                            style={{ padding: '4px 8px', margin: 0, fontSize: '12px', width: 'auto' }}
                            onClick={() => handleUpdateSlide(slide.id, 'bodyText', (slide.bodyText || '') + '<br>')}
                          >
                            <Plus size={14} /> 改行追加
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={slide.bodyText || ''}
                        onChange={(e) => handleUpdateSlide(slide.id, 'bodyText', e.target.value)}
                        placeholder="フリーテキストを入力してください... (上のボタンで改行追加)"
                      />
                    </div>
                  )}
                </>
              )}

              {/* CTA Fields */}
              {slide.type === 'cta' && (
                <>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>メインメッセージ (HTML可)</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="titleScale" value={slide.titleScale} />
                    </div>
                    <textarea
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>サブメッセージ (HTML可)</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="catchphraseScale" value={slide.catchphraseScale} />
                    </div>
                    <textarea
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateSlide(slide.id, 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>ボタンテキスト</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="footerScale" value={slide.footerScale} />
                    </div>
                    <input
                      type="text"
                      value={slide.buttonText}
                      onChange={(e) => handleUpdateSlide(slide.id, 'buttonText', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Profile Fields */}
              {slide.type === 'profile' && (
                <>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>名前</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="nameScale" value={slide.nameScale} />
                    </div>
                    <input
                      type="text"
                      value={slide.name}
                      onChange={(e) => handleUpdateSlide(slide.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>肩書き</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="roleScale" value={slide.roleScale} />
                    </div>
                    <input
                      type="text"
                      value={slide.role}
                      onChange={(e) => handleUpdateSlide(slide.id, 'role', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>キャッチフレーズ (HTML可)</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="catchphraseScale" value={slide.catchphraseScale} />
                    </div>
                    <textarea
                      value={slide.catchphrase}
                      onChange={(e) => handleUpdateSlide(slide.id, 'catchphrase', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0 }}>サービス内容</label>
                      <FontSizeSlider slideId={slide.id} fieldKey="servicesScale" value={slide.servicesScale} />
                    </div>
                    <div className="bullet-list-editor">
                      {slide.services.map((s, sIdx) => (
                        <div key={sIdx} className="bullet-item">
                          <GripVertical size={18} color="#484f58" style={{ marginTop: '10px' }} />
                          <input
                            type="text"
                            value={s}
                            onChange={(e) => handleUpdateArrayItem(slide.id, 'services', sIdx, e.target.value)}
                          />
                          <button className="icon-btn delete" onClick={() => handleRemoveArrayItem(slide.id, 'services', sIdx)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-btn" onClick={() => handleAddArrayItem(slide.id, 'services')}>
                      <Plus size={16} /> サービスを追加
                    </button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="preview-area">
        <button
          className="download-all-btn"
          onClick={handleDownloadAll}
          disabled={isDownloading}
        >
          <DownloadCloud size={24} />
          {isDownloading ? '画像生成・ZIP圧縮中...' : '全10枚をZIPでまとめて保存'}
        </button>

        <div className="slides-wrapper">
          {slides.map((slide) => (
            <Slide
              key={slide.id}
              id={slide.id}
              data={{ ...slide, bgImage: getBackgroundImage(slide.type, slide.bgImage) }}
            />
          ))}
        </div>
      </div>

      {/* AI Import Modal */}
      {isAIModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '600px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d1117' }}>
              <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#f4d990" /> AIで作った文章を一括流し込み
              </h2>
              <button
                onClick={() => setIsAIModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#c9d1d9', lineHeight: 1.5 }}>
                Gemini等のAIで出力された <strong>JSON（配列）データ</strong> を下の枠に貼り付けてください。<br />
                ※対象は <strong>スライド1枚目（表紙）〜8枚目</strong> です。（先頭のデータが表紙に割り当てられます）
              </p>
              <div style={{ backgroundColor: '#0d1117', padding: '15px', borderRadius: '6px', border: '1px solid #30363d', fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>
                【入力フォーマット例：全8要素】<br />
                [<br />
                &nbsp;&nbsp;&#123; "catchphrase": "〇〇な人へ", "title": "解決策&lt;br&gt;7選" &#125;, &nbsp;// ← 1枚目(表紙) <br />
                &nbsp;&nbsp;&#123; "title": "【1】 どんな内容でもOK", "content": "「content」キーに文章や箇条書きを指定すると、アプリが勝手に判別します！" &#125;, <br />
                &nbsp;&nbsp;&#123; "title": "【2】 箇条書き", "content": ["ポイント1", "ポイント2"] &#125;, // ← 3枚目<br />
                &nbsp;&nbsp;...<br />
                ]
              </div>
              <textarea
                placeholder="ここにJSONデータを貼り付けてください..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                style={{ width: '100%', height: '200px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', padding: '15px', borderRadius: '6px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#0d1117' }}>
              <button
                onClick={() => setIsAIModalOpen(false)}
                style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #30363d', backgroundColor: '#21262d', color: '#c9d1d9', cursor: 'pointer', fontWeight: 600 }}
              >
                キャンセル
              </button>
              <button
                onClick={handleAIImport}
                style={{ padding: '10px 30px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #1f6feb, #388bfd)', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                流し込む
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '420px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d1117' }}>
              <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#3fb950' }}>
                <Save size={20} /> プロジェクトを保存
              </h2>
              <button onClick={() => setIsSaveModalOpen(false)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#c9d1d9' }}>保存するプロジェクト名を入力してください。</p>
              <input
                type="text"
                placeholder="例: AI活用事例_2024"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveProject()}
                style={{ padding: '10px 14px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#0d1117' }}>
              <button onClick={() => setIsSaveModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #30363d', backgroundColor: '#21262d', color: '#c9d1d9', cursor: 'pointer', fontWeight: 600 }}>キャンセル</button>
              <button onClick={handleSaveProject} disabled={isSaving} style={{ padding: '10px 30px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #2ea043, #3fb950)', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
                {isSaving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {isLoadModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '520px', maxHeight: '70vh', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d1117' }}>
              <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#79c0ff' }}>
                <FolderOpen size={20} /> 保存済みプロジェクト
              </h2>
              <button onClick={() => setIsLoadModalOpen(false)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {isLoading ? (
                <p style={{ color: '#8b949e', textAlign: 'center' }}>読み込み中...</p>
              ) : savedProjects.length === 0 ? (
                <p style={{ color: '#8b949e', textAlign: 'center' }}>保存済みプロジェクトはありません。</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedProjects.map((project) => (
                    <div key={project.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #30363d' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#c9d1d9' }}>{project.id}</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8b949e' }}>
                          {project.updatedAt?.toDate ? project.updatedAt.toDate().toLocaleString('ja-JP') : '日時不明'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleLoadProject(project.id)}
                          style={{ padding: '6px 14px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #1f6feb, #388bfd)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                        >
                          読み込む
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          style={{ padding: '6px 10px', borderRadius: '50px', border: '1px solid #f85149', background: 'transparent', color: '#f85149', cursor: 'pointer', fontSize: '13px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
