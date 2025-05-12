import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./QRScanner.css";

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("QRScannerがマウントされました");
    const codeReader = new BrowserQRCodeReader();
    let mounted = true;

    const startDecoding = async () => {
      if (!videoRef.current) return;

      try {
        console.log("カメラへのアクセスをリクエスト中...");

        // カメラの許可を明示的に確認
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (!mounted) {
          // コンポーネントがアンマウントされていたら、ストリームを停止
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log("カメラアクセス許可済み、デコーダー起動中...");

        // ビデオ要素にストリームを設定
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, err) => {
            if (!mounted) return;

            if (result) {
              console.log("✅ QRコード:", result.getText());
              // 読み取り後に停止する
              if (controlsRef.current) {
                controlsRef.current.stop();
              }
            }
            if (
              err &&
              err.message !==
                "No MultiFormat Readers were able to detect the code."
            ) {
              // console.error("QRコード読み取りエラー:", err);
            }
          }
        );
        // コントロール参照を保存
        controlsRef.current = controls;
        console.log("カメラ起動完了");
      } catch (error: any) {
        if (!mounted) return;

        console.error("カメラ起動エラー:", error);
        setError(error.message || "カメラへのアクセスに失敗しました。");

        // NotFoundErrorの場合はデバイスが見つからない
        if (error.name === "NotFoundError") {
          setError("カメラデバイスが見つかりません。");
        }
        // NotAllowedErrorの場合はユーザーが許可しなかった
        else if (error.name === "NotAllowedError") {
          setError(
            "カメラへのアクセスが許可されていません。ブラウザの設定でカメラへのアクセスを許可してください。"
          );
        }
        // その他のエラー
        else {
          setError(`カメラエラー: ${error.message || "不明なエラー"}`);
        }
      }
    };

    // カメラ起動を少し遅延させる（DOMレンダリング完了を待つ）
    const timeoutId = setTimeout(() => {
      if (mounted) {
        startDecoding();
      }
    }, 500);

    // コンポーネントのアンマウント時に実行される
    return () => {
      console.log("QRScannerがアンマウントされます");
      mounted = false;
      clearTimeout(timeoutId);

      if (controlsRef.current) {
        console.log("カメラ停止中...");
        controlsRef.current.stop();
        controlsRef.current = null;
      }

      // ビデオストリームの停止
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("ビデオトラック停止:", track.label);
        });
      }

      console.log("カメラリソース解放完了");
    };
  }, []);

  return (
    <div className="qr-scanner-container">
      {error ? (
        <div className="qr-error">
          <p>{error}</p>
          <p>カメラへのアクセスを確認してください。</p>
        </div>
      ) : (
        <video className="qr-scanner" ref={videoRef} autoPlay playsInline />
      )}
    </div>
  );
};

export default QRScanner;
