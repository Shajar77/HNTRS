import { useState } from 'react'

// IPFS upload hook using Pinata or NFT.Storage
// For production, use Pinata SDK or NFT.Storage SDK

const useIPFS = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Pinata API credentials (set in .env)
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY

  // Upload file to IPFS via Pinata
  const uploadFile = async (file) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const data = await response.json()
      const ipfsHash = data.IpfsHash
      const ipfsUrl = `ipfs://${ipfsHash}`
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

      return { ipfsUrl, gatewayUrl, hash: ipfsHash }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  // Upload JSON metadata to IPFS
  const uploadMetadata = async (metadata) => {
    setUploading(true)
    setError(null)

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS')
      }

      const data = await response.json()
      const ipfsHash = data.IpfsHash
      const ipfsUrl = `ipfs://${ipfsHash}`
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

      return { ipfsUrl, gatewayUrl, hash: ipfsHash }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  // Upload image and create NFT metadata
  const uploadNFT = async (file, metadata) => {
    setUploading(true)
    setError(null)

    try {
      // Upload image first
      const imageResult = await uploadFile(file)

      // Create NFT metadata following ERC-721 standard
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: imageResult.ipfsUrl,
        external_url: metadata.externalUrl || '',
        attributes: metadata.attributes || [],
        properties: {
          category: metadata.category,
          creator: metadata.creator,
          created_at: new Date().toISOString(),
          ...metadata.properties,
        },
      }

      // Upload metadata
      const metadataResult = await uploadMetadata(nftMetadata)

      return {
        image: imageResult,
        metadata: metadataResult,
        tokenURI: metadataResult.ipfsUrl,
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  // Get gateway URL from IPFS URL
  const getGatewayUrl = (ipfsUrl) => {
    if (!ipfsUrl) return ''
    if (ipfsUrl.startsWith('ipfs://')) {
      const hash = ipfsUrl.replace('ipfs://', '')
      return `https://gateway.pinata.cloud/ipfs/${hash}`
    }
    return ipfsUrl
  }

  return {
    uploadFile,
    uploadMetadata,
    uploadNFT,
    getGatewayUrl,
    uploading,
    error,
  }
}

export default useIPFS
