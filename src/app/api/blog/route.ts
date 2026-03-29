import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (published !== 'all') where.published = true
    if (category && category !== 'All') where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: featured === '1' ? { createdAt: 'desc' } : { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({ posts, total, pages: Math.ceil(total / limit), page })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, coverImage, published, author, category } = body
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').slice(0, 100)
    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        published: published ?? false,
        author: author || 'Vidi Vici',
        category: category || 'News & Updates',
        slug,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Blog create error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
